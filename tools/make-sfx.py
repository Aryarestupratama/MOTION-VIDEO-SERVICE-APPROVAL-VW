#!/usr/bin/env python3
"""Membuat efek suara VW PIK dari nol (sintesis). Tidak memakai sampel pihak ketiga.

Jalankan dari root project:
    pip install numpy scipy
    python3 tools/make-sfx.py
Hasil: public/audio/sfx/*.wav (mono, 44.1 kHz, 16-bit).
"""
import os
import wave

import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "sfx")
rng = np.random.default_rng(7)  # seed tetap: hasil selalu sama


def t_axis(sec):
    return np.arange(int(SR * sec)) / SR


def norm(x, peak=0.8):
    return x / (np.max(np.abs(x)) + 1e-9) * peak


def fade_edges(x, ms=4):
    n = int(SR * ms / 1000)
    x = x.copy()
    x[:n] *= np.linspace(0, 1, n)
    x[-n:] *= np.linspace(1, 0, n)
    return x


def sweep_noise(sec, f_start, f_end, bands=10, sigma=1.1):
    """Noise yang pusat frekuensinya bergeser (whoosh), tanpa artefak klik.

    Noise difilter ke beberapa pita tetap, lalu bobot tiap pita digeser
    sepanjang waktu (cross-fade halus), jadi tidak ada koefisien filter berubah.
    """
    n = int(SR * sec)
    noise = rng.standard_normal(n)
    centers = np.geomspace(f_start, f_end, bands)
    pos = np.linspace(0, bands - 1, n)  # posisi pusat sapuan terhadap indeks pita
    out = np.zeros(n)
    for k, fc in enumerate(centers):
        lo, hi = fc / 1.35, min(fc * 1.35, SR / 2 - 200)
        sos = butter(2, [lo, hi], btype="band", fs=SR, output="sos")
        band = sosfilt(sos, noise)
        out += band * np.exp(-((pos - k) ** 2) / (2 * sigma**2))
    return out


def whoosh(sec=0.7, f0=400, f1=3200):
    x = sweep_noise(sec, f0, f1)
    t = np.linspace(0, 1, len(x))
    env = np.sin(np.pi * t) ** 2.2
    return fade_edges(norm(x * env))


def swipe():
    return whoosh(0.35, 900, 3800)


def tap():
    t = t_axis(0.18)
    body = np.sin(2 * np.pi * 220 * t) * np.exp(-t * 55)
    click = sosfilt(butter(2, 2500, btype="low", fs=SR, output="sos"), rng.standard_normal(len(t))) * np.exp(-t * 400)
    return fade_edges(norm(body * 0.8 + click * 0.5))


def tick():
    t = t_axis(0.09)
    return fade_edges(norm(np.sin(2 * np.pi * 1900 * t) * np.exp(-t * 90)))


def pop():
    t = t_axis(0.22)
    f = 260 + 520 * (1 - np.exp(-t * 40))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return fade_edges(norm(np.sin(ph) * np.exp(-t * 22)))


def bell(freqs, amps, decay, sec):
    t = t_axis(sec)
    x = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, a, d in zip(freqs, amps, decay))
    attack = np.minimum(1, t / 0.006)
    return fade_edges(norm(x * attack), 8)


def chime():
    # Dua nada lembut naik (G5 lalu D6), terasa "berhasil".
    a = bell([784, 1568], [1, 0.25], [4.5, 7], 1.2)
    b = bell([1175, 2350], [1, 0.2], [3.8, 6], 1.0)
    out = np.zeros(int(SR * 1.2))
    out[: len(a)] += a * 0.8
    off = int(SR * 0.11)
    out[off : off + len(b)] += b[: len(out) - off] * 0.9
    return fade_edges(norm(out))


def thud():
    t = t_axis(0.6)
    f = 55 + 70 * np.exp(-t * 14)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 7)
    air = sosfilt(butter(2, 300, btype="low", fs=SR, output="sos"), rng.standard_normal(len(t))) * np.exp(-t * 30) * 0.4
    return fade_edges(norm(body + air), 6)


def ding():
    return bell([1760, 2637, 3520], [1, 0.35, 0.12], [5.5, 8, 11], 0.9)


SOUNDS = {
    "whoosh": whoosh,
    "swipe": swipe,
    "tap": tap,
    "tick": tick,
    "pop": pop,
    "chime": chime,
    "thud": thud,
    "ding": ding,
}


def write_wav(path, x):
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, fn in SOUNDS.items():
        write_wav(os.path.join(OUT, f"{name}.wav"), fn())
        print("ok", name)

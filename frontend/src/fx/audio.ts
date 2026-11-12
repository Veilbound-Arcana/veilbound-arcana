import { useGameStore } from "@/store/useGameStore";

class SoundEngine {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  private getVolume(isMusic = false): number {
    const settings = useGameStore.getState().save.settings;
    return isMusic ? settings.musicVolume : settings.sfxVolume;
  }

  private triggerHaptic(pattern: number | number[]) {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        /* Ignore on unsupported devices */
      }
    }
  }

  // 1. Seal tear: filtered noise sweep, 200 ms (haptic: 15 ms)
  playSealTear() {
    this.initCtx();
    if (!this.ctx) return;
    const vol = this.getVolume(false);
    if (vol <= 0) return;

    this.triggerHaptic(15);

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // 2. Card flip: soft click plus shimmer
  playCardFlip() {
    this.initCtx();
    if (!this.ctx) return;
    const vol = this.getVolume(false);
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(vol * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // 3. Rune reveal: single chime (celesta)
  playRuneReveal() {
    this.initCtx();
    if (!this.ctx) return;
    const vol = this.getVolume(false);
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1046.5, now); // C6

    gain.gain.setValueAtTime(vol * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  // 4. Moon reveal: 3-note arpeggio (haptic: [10, 30, 10])
  playMoonReveal() {
    this.initCtx();
    if (!this.ctx) return;
    const vol = this.getVolume(false);
    if (vol <= 0) return;

    this.triggerHaptic([10, 30, 10]);

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + i * 0.1);

      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(vol * 0.5, now + i * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.8);
    });
  }

  // 5. Veil reveal: choir swell, 1.6 s (haptic: [20, 40, 20])
  playVeilReveal() {
    this.initCtx();
    if (!this.ctx) return;
    const vol = this.getVolume(false);
    if (vol <= 0) return;

    this.triggerHaptic([20, 40, 20]);

    const now = this.ctx.currentTime;
    const chord = [261.63, 329.63, 392.0, 523.25, 659.25]; // C4, E4, G4, C5, E5

    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(vol * 0.25, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.6);
    });
  }

  // 6. KO: glass shatter (haptic: 25 ms)
  playKO() {
    this.initCtx();
    if (!this.ctx) return;
    const vol = this.getVolume(false);
    if (vol <= 0) return;

    this.triggerHaptic(25);

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(2500, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // 7. Win motif: rising triumph arpeggio
  playWin() {
    this.initCtx();
    if (!this.ctx) return;
    const vol = this.getVolume(false);
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5

    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + i * 0.12);

      gain.gain.setValueAtTime(0, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(vol * 0.4, now + i * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.9);
    });
  }

  // 8. Loss motif: falling contemplative swell
  playLoss() {
    this.initCtx();
    if (!this.ctx) return;
    const vol = this.getVolume(false);
    if (vol <= 0) return;

    const now = this.ctx.currentTime;
    const notes = [440, 392, 349.23, 293.66]; // A4, G4, F4, D4

    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.18);

      gain.gain.setValueAtTime(0, now + i * 0.18);
      gain.gain.linearRampToValueAtTime(vol * 0.35, now + i * 0.18 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 1.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.18);
      osc.stop(now + i * 0.18 + 1.1);
    });
  }
}

export const audio = new SoundEngine();

export const playSealTear = (_vol?: number, _muted?: boolean) => audio.playSealTear();
export const playCardFlip = (_vol?: number, _muted?: boolean) => audio.playCardFlip();
export const playRuneReveal = (_vol?: number, _muted?: boolean) => audio.playRuneReveal();
export const playMoonReveal = (_vol?: number, _muted?: boolean) => audio.playMoonReveal();
export const playVeilReveal = (_vol?: number, _muted?: boolean) => audio.playVeilReveal();
export const playKo = (_vol?: number, _muted?: boolean) => audio.playKO();
export const playWin = (_vol?: number, _muted?: boolean) => audio.playWin();
export const playLoss = (_vol?: number, _muted?: boolean) => audio.playLoss();

export const playChime = playRuneReveal;
export const playArpeggio = playMoonReveal;
export const playChoirSwell = playVeilReveal;
export const playKoShatter = () => audio.playKO();
export const playWinMotif = playWin;
export const playLossMotif = playLoss;


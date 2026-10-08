/**
 * Dynamic Cinematic Procedural Music & Sound Effects Engine
 * Generates continuous adaptive background scores tailored to game states and tabs
 * with smooth crossfading, intensity scaling, and responsive tactical SFX.
 */

export type MusicTheme = 
  | 'command'
  | 'arsenal'
  | 'market'
  | 'personnel'
  | 'territory'
  | 'businesses'
  | 'operations'
  | 'crisis'
  | 'combat'
  | 'negotiation'
  | 'victory'
  | 'failure';

class DynamicAudioEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private musicVolume: number = 0.35;
  private sfxVolume: number = 0.55;

  private currentTheme: MusicTheme = 'command';
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private sequenceTimer: number | null = null;
  private step: number = 0;
  private tensionLevel: number = 0; // 0 to 100 based on Wanted/Police Pressure

  constructor() {
    const savedMuted = localStorage.getItem('underworld_audio_muted');
    if (savedMuted !== null) {
      this.muted = savedMuted === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.musicGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 1, this.ctx.currentTime);
        this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
        this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);

        this.musicGain.connect(this.masterGain);
        this.sfxGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);

        this.startMusicLoop();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    localStorage.setItem('underworld_audio_muted', String(muted));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.08);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  public setTension(tension: number) {
    this.tensionLevel = Math.max(0, Math.min(100, tension));
  }

  /**
   * Smoothly crossfades to a new musical mood/theme
   */
  public setTheme(newTheme: MusicTheme) {
    if (this.currentTheme === newTheme) return;
    this.currentTheme = newTheme;
    this.initCtx();
  }

  /**
   * Procedural dynamic music generator tick
   */
  private startMusicLoop() {
    if (this.sequenceTimer !== null) return;

    const tick = () => {
      this.playMusicStep();
      // Tick speed adjusts according to theme & tension
      let delay = 600;
      if (this.currentTheme === 'combat') delay = 280;
      else if (this.currentTheme === 'crisis') delay = 320;
      else if (this.currentTheme === 'operations') delay = 480;
      else if (this.currentTheme === 'arsenal') delay = 650;
      else if (this.currentTheme === 'market') delay = 450;
      else if (this.currentTheme === 'personnel') delay = 800;

      // High tension speeds up pulse slightly
      if (this.tensionLevel > 50) {
        delay = Math.round(delay * (1 - (this.tensionLevel - 50) * 0.003));
      }

      this.sequenceTimer = window.setTimeout(tick, delay);
    };

    tick();
  }

  private playMusicStep() {
    if (this.muted || !this.ctx || !this.musicGain) return;

    this.step = (this.step + 1) % 16;
    const now = this.ctx.currentTime;

    // Theme frequency maps
    const themeChords: Record<MusicTheme, number[]> = {
      command: [55, 110, 164.81, 220, 277.18],     // Deep A minor noir
      arsenal: [65.41, 130.81, 196, 261.63, 392],   // Industrial C cold
      market: [73.42, 146.83, 220, 293.66, 370],   // Tense D minor rhythm
      personnel: [82.41, 164.81, 246.94, 329.63],   // Contemplative E minor
      territory: [55, 82.41, 110, 164.81],          // Low geopolitical drone
      businesses: [65.41, 98, 130.81, 196],         // Corporate smooth bass
      operations: [55, 110, 146.83, 220],           // Cinematic heist pulse
      crisis: [58.27, 116.54, 155.56, 233.08],      // High tension Bb diminished
      combat: [49, 98, 147, 196, 294],              // Aggressive G minor strike
      negotiation: [61.74, 123.47, 185, 246.94],    // B tension
      victory: [65.41, 130.81, 196, 261.63, 329.63],// C major fanfare
      failure: [46.25, 92.5, 138.59, 185]           // Low F# gloomy drone
    };

    const notes = themeChords[this.currentTheme] || themeChords.command;

    // 1. Sub-bass Drone on step 0, 4, 8, 12
    if (this.step % 4 === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = this.currentTheme === 'combat' || this.currentTheme === 'crisis' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(notes[0], now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140 + (this.tensionLevel * 2), now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 1.2);
    }

    // 2. Harmonic Pad / Arpeggio
    if (this.step % 2 === 0 || this.currentTheme === 'combat' || this.currentTheme === 'crisis') {
      const noteIdx = (this.step % (notes.length - 1)) + 1;
      const noteFreq = notes[noteIdx] || notes[1];

      const padOsc = this.ctx.createOscillator();
      const padGain = this.ctx.createGain();

      padOsc.type = 'triangle';
      padOsc.frequency.setValueAtTime(noteFreq, now);

      const amp = this.currentTheme === 'crisis' ? 0.05 : 0.035;
      padGain.gain.setValueAtTime(amp, now);
      padGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      padOsc.connect(padGain);
      padGain.connect(this.musicGain);

      padOsc.start(now);
      padOsc.stop(now + 0.6);
    }

    // 3. Subtle Ticking Percussion / Heartbeat for high tension or combat
    if (this.currentTheme === 'crisis' || this.currentTheme === 'combat' || this.tensionLevel > 60) {
      const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.04, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.4;

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const nFilter = this.ctx.createBiquadFilter();
      nFilter.type = 'bandpass';
      nFilter.frequency.setValueAtTime(1200, now);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.03, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      noise.connect(nFilter);
      nFilter.connect(nGain);
      nGain.connect(this.musicGain);
      noise.start(now);
    }
  }

  // --- SHORT TACTICAL SOUND EFFECTS ---
  public playClick() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  public playGunRack() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    [0, 0.07].forEach((delay) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(190, now + delay);
      osc.frequency.exponentialRampToValueAtTime(50, now + delay + 0.06);

      gain.gain.setValueAtTime(0.18, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + delay);
      osc.stop(now + delay + 0.06);
    });
  }

  public playCash() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    [1046.5, 1318.5, 1567.98].forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.1, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.16);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.16);
    });
  }

  public playLevelUp() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [440, 554.37, 659.25, 880];
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.12, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.25);
    });
  }

  public playCrisisAlert() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    this.setTheme('crisis');
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.linearRampToValueAtTime(680, now + 0.2);
    osc.frequency.linearRampToValueAtTime(340, now + 0.4);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  public playShot() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.09;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.09);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);
  }

  public playVictory() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    this.setTheme('victory');
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.14, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.4);
    });
  }

  public playFailure() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    this.setTheme('failure');
    const notes = [220, 207.65, 196, 174.61];
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.14, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.35);
    });
  }

  public playDiscovery() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [440, 659.25, 880, 1318.5];
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.12, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.5);
    });
  }
}

export const sounds = new DynamicAudioEngine();

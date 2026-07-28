/**
 * Minimalist Web Audio API synthesizer for 8-bit sound effects.
 * Requires no external audio files.
 */

class SynthAudio {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3; // Global volume
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq: number, type: OscillatorType, duration: number, vol = 1) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Envelope
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // SFX Presets
  
  /** Short blip when dragging over a letter */
  pop() {
    this.playTone(800, 'sine', 0.1, 0.2);
  }

  /** Happy chime when finding a word */
  success() {
    this.init();
    if (!this.ctx) return;
    
    // Play an arpeggio (C major chord)
    setTimeout(() => this.playTone(523.25, 'sine', 0.2, 0.4), 0);   // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.2, 0.4), 100); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.4, 0.4), 200); // G5
  }

  /** Low buzz when wrong */
  error() {
    this.playTone(150, 'square', 0.3, 0.5);
    setTimeout(() => this.playTone(100, 'square', 0.3, 0.5), 100);
  }

  /** Triumphant fanfare */
  victory() {
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 523.25, 523.25, 698.46, 523.25, 698.46]; // C C C F C F
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 'square', 0.3, 0.3);
      }, i * 150);
    });
  }
}

export const audio = new SynthAudio();

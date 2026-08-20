/**
 * Sound and Speech Synthesis Manager for FitPulse
 * Uses Web Audio API for custom synthesized tones and the Web Speech API for voice coaching.
 */

let audioCtx: AudioContext | null = null;
let currentAlarmInterval: any = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a single frequency tone with envelope
 */
export function playTone(freq: number, type: OscillatorType, duration: number, startTime = 0, gainLevel = 0.15) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

    gain.gain.setValueAtTime(gainLevel, ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);
  } catch (e) {
    console.warn('Audio tone playback failed:', e);
  }
}

/**
 * Play countdown cue beep
 */
export function playCountdownBeep(isGo = false) {
  try {
    if (isGo) {
      // High pitch triumph chime
      playTone(880, 'triangle', 0.4, 0, 0.25);
      playTone(1108.73, 'triangle', 0.4, 0.08, 0.25);
      playTone(1318.51, 'sine', 0.6, 0.16, 0.25);
    } else {
      // Short tick beep
      playTone(523.25, 'sine', 0.15, 0, 0.2);
    }
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Play Rest Interval Completed sound
 */
export function playRestCompleteSound() {
  try {
    playTone(587.33, 'sine', 0.2, 0, 0.2); // D5
    playTone(739.99, 'sine', 0.2, 0.12, 0.2); // F#5
    playTone(880, 'sine', 0.5, 0.24, 0.25); // A5
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Synthesize various alarm sounds
 */
export function playAlarmSound(soundType: string) {
  try {
    if (soundType === 'gentle-bell') {
      // Tibetan bowl / calm bell sound
      playTone(432, 'sine', 1.5, 0, 0.3);
      playTone(864, 'sine', 1.2, 0.05, 0.15);
      playTone(1296, 'sine', 0.9, 0.1, 0.08);
    } else if (soundType === 'marimba') {
      // Warm marimba arpeggio
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, i) => {
        playTone(freq, 'triangle', 0.35, i * 0.1, 0.22);
      });
    } else if (soundType === 'voice-coach') {
      playTone(523.25, 'sine', 0.2, 0, 0.2);
      playTone(659.25, 'sine', 0.3, 0.15, 0.25);
    } else {
      // Default: energetic-chime
      playTone(523.25, 'triangle', 0.25, 0, 0.25);
      playTone(659.25, 'triangle', 0.25, 0.12, 0.25);
      playTone(783.99, 'triangle', 0.25, 0.24, 0.25);
      playTone(1046.5, 'sine', 0.5, 0.36, 0.3);
    }
  } catch (e) {
    console.warn('Alarm sound failed:', e);
  }
}

/**
 * Start repeating alarm chime loop
 */
export function startAlarmRinger(soundType: string, instructionVoice?: string) {
  stopAlarmRinger();
  playAlarmSound(soundType);

  if (instructionVoice) {
    speakText(`Reminder: ${instructionVoice}`);
  }

  currentAlarmInterval = setInterval(() => {
    playAlarmSound(soundType);
  }, 3500);
}

/**
 * Stop alarm chime loop
 */
export function stopAlarmRinger() {
  if (currentAlarmInterval) {
    clearInterval(currentAlarmInterval);
    currentAlarmInterval = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speech Synthesis for Voice Coaching
 */
export function speakText(text: string, force = false) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    
    // Choose a friendly English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => (v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Female')))) || voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis failed:', e);
  }
}

/**
 * Utility to play notification sound using Web Audio API
 * Creates a simple beep sound without needing an audio file
 */

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Play a notification sound
 * Creates a pleasant two-tone beep
 */
export const playNotificationSound = (): void => {
  try {
    const ctx = getAudioContext();
    
    // First tone
    const oscillator1 = ctx.createOscillator();
    const gainNode1 = ctx.createGain();
    
    oscillator1.connect(gainNode1);
    gainNode1.connect(ctx.destination);
    
    oscillator1.frequency.value = 800; // Hz
    oscillator1.type = 'sine';
    
    gainNode1.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    oscillator1.start(ctx.currentTime);
    oscillator1.stop(ctx.currentTime + 0.1);
    
    // Second tone (slightly higher)
    const oscillator2 = ctx.createOscillator();
    const gainNode2 = ctx.createGain();
    
    oscillator2.connect(gainNode2);
    gainNode2.connect(ctx.destination);
    
    oscillator2.frequency.value = 1000; // Hz
    oscillator2.type = 'sine';
    
    gainNode2.gain.setValueAtTime(0.3, ctx.currentTime + 0.1);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    oscillator2.start(ctx.currentTime + 0.1);
    oscillator2.stop(ctx.currentTime + 0.2);
    
  } catch (error) {
    console.error('Could not play notification sound:', error);
  }
};

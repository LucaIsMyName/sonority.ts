// src/utils/audioManager.ts
type PlayerCallback = () => void;

class AudioManager {
  private static instance: AudioManager;
  private currentPlayerId: string | null = null;
  private callbacks: Map<string, PlayerCallback> = new Map();

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  registerPlayer(playerId: string, pauseCallback: PlayerCallback) {
    this.callbacks.set(playerId, pauseCallback);
  }

  unregisterPlayer(playerId: string) {
    this.callbacks.delete(playerId);
  }

  notifyPlayStarted(playerId: string) {
    if (this.currentPlayerId && this.currentPlayerId !== playerId) {
      // Pause the previously playing player
      const pauseCallback = this.callbacks.get(this.currentPlayerId);
      if (pauseCallback) {
        pauseCallback();
      }
    }
    this.currentPlayerId = playerId;
  }
}

export const audioManager = AudioManager.getInstance();
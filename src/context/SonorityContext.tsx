// src/context/SonorityContext.tsx
import React, { createContext, useContext, useReducer, useRef, useEffect } from "react";
import type { TrackProps, PlaylistProps } from "../types";
import { audioManager } from "../utils/audioManager";

interface SonorityState {
  currentTrack: TrackProps | null;
  currentPlaylist: PlaylistProps | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffled: boolean;
  isRepeating: boolean;
  isRepeatingOne: boolean;
  queue: TrackProps[];
}

interface AudioControls {
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

interface SonorityContextType {
  state: SonorityState;
  dispatch: React.Dispatch<SonorityAction>;
  audioControls: AudioControls; // Add this line
}

const initialState: SonorityState = {
  currentTrack: null,
  currentPlaylist: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isShuffled: false,
  isRepeating: false,
  isRepeatingOne: false,
  queue: [],
};

export const SonorityContext = createContext<SonorityContextType | null>(null);

type SonorityAction = { type: "SET_TRACK"; payload: TrackProps } | { type: "SET_PLAYLIST"; payload: PlaylistProps } | { type: "PLAY" } | { type: "PAUSE" } | { type: "SET_VOLUME"; payload: number } | { type: "SET_TIME"; payload: number } | { type: "TOGGLE_SHUFFLE" } | { type: "TOGGLE_REPEAT" } | { type: "TOGGLE_REPEAT_ONE" } | { type: "NEXT_TRACK" } | { type: "PREVIOUS_TRACK" } | { type: "SET_QUEUE"; payload: TrackProps[] };

const sonorityReducer = (state: SonorityState, action: SonorityAction): SonorityState => {
  switch (action.type) {
    case "SET_TRACK": {
      return {
        ...state,
        currentTrack: action.payload,
        currentTime: 0,
        // Don't change isPlaying state here
      };
    }
    case "TOGGLE_SHUFFLE":
      return {
        ...state,
        isShuffled: !state.isShuffled,
        queue: state.isShuffled
          ? [...state.queue].sort(() => Math.random() - 0.5) // Shuffle when turned on
          : state.currentPlaylist?.tracks || state.queue, // Restore original order
      };

    case "TOGGLE_REPEAT":
      return {
        ...state,
        isRepeating: !state.isRepeating,
        isRepeatingOne: false, // Disable repeat one when toggling repeat
      };

    case "TOGGLE_REPEAT_ONE":
      return {
        ...state,
        isRepeatingOne: !state.isRepeatingOne,
        isRepeating: false, // Disable repeat all when toggling repeat one
      };
    case "SET_PLAYLIST":
      return {
        ...state,
        currentPlaylist: action.payload,
        queue: action.payload.tracks || [], // Update queue when playlist changes
      };
    case "PLAY":
      return { ...state, isPlaying: true };
    case "PAUSE":
      return { ...state, isPlaying: false };
    case "SET_VOLUME":
      return { ...state, volume: action.payload };
    case "SET_TIME":
      return { ...state, currentTime: action.payload };
    case "SET_DURATION":
      return { ...state, duration: action.payload };
    case "SET_QUEUE":
      return { ...state, queue: action.payload };
    case "NEXT_TRACK": {
      const currentIndex = state.queue.findIndex((track) => track.id === state.currentTrack?.id);
      const nextIndex = currentIndex + 1 >= state.queue.length ? 0 : currentIndex + 1;
      return {
        ...state,
        currentTrack: state.queue[nextIndex] || state.currentTrack,
        currentTime: 0,
        isPlaying: state.isPlaying, // Maintain play state when changing tracks
      };
    }
    case "PREVIOUS_TRACK": {
      const currentIndex = state.queue.findIndex((track) => track.id === state.currentTrack?.id);
      const prevIndex = currentIndex <= 0 ? state.queue.length - 1 : currentIndex - 1;
      return {
        ...state,
        currentTrack: state.queue[prevIndex] || state.currentTrack,
        currentTime: 0,
        isPlaying: state.isPlaying, // Maintain play state when changing tracks
      };
    }
    default:
      return state;
  }
};

export const SonorityProvider: React.FC<{ children: React.ReactNode; id: any }> = ({ children, id = crypto.randomUUID() }) => {
  const [state, dispatch] = useReducer(sonorityReducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerIdRef = useRef(id);

  useEffect(() => {
    // Register this player with the audio manager
    audioManager.registerPlayer(playerIdRef.current, () => {
      dispatch({ type: "PAUSE" });
    });

    return () => {
      audioManager.unregisterPlayer(playerIdRef.current);
    };
  }, []);
  // Create audio element on mount
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = "auto";
    // Enable CORS
    audioRef.current.crossOrigin = "anonymous";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (state.isPlaying) {
      audioManager.notifyPlayStarted(playerIdRef.current);
      audioRef.current.play().catch((error) => {
        console.warn("Playback error:", error);
        dispatch({ type: "PAUSE" });
      });
    } else {
      audioRef.current.pause();
    }
  }, [state.isPlaying]);

  // Handle track changes
  useEffect(() => {
    if (!audioRef.current || !state.currentTrack) return;

    const audio = audioRef.current;

    // Setup new track
    const setupNewTrack = () => {
      audio.src = state.currentTrack?.src || "";
      audio.load();
      // Only auto-play if user has already started playback
      if (state.isPlaying) {
        audio.play().catch((error) => {
          console.log("Playback prevented:", error);
          dispatch({ type: "PAUSE" });
        });
      }
    };

    // Event listeners
    const handleLoadedMetadata = () => {
      dispatch({ type: "SET_DURATION", payload: audio.duration });
    };

    const handleTimeUpdate = () => {
      dispatch({ type: "SET_TIME", payload: audio.currentTime });
    };

    const handleEnded = () => {
      if (state.isRepeatingOne) {
        audio.currentTime = 0;
        audio.play().catch(console.warn);
      } else if (state.isRepeating) {
        // If repeat all is on, go to next track or first track
        const currentIndex = state.queue.findIndex((track) => track.id === state.currentTrack?.id);
        const nextIndex = (currentIndex + 1) % state.queue.length;
        dispatch({
          type: "SET_TRACK",
          payload: state.queue[nextIndex],
        });
      } else if (state.queue.length > 0) {
        // Normal playlist progression
        dispatch({ type: "NEXT_TRACK" });
      } else {
        dispatch({ type: "PAUSE" });
      }
    };

    const handleError = (e: ErrorEvent) => {
      console.warn("Audio error:", e);
      // Try to recover by reloading
      audio.load();
    };

    // Add listeners
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    // Setup track
    setupNewTrack();

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [state.currentTrack?.id]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !state.currentTrack) return;

    if (state.isPlaying) {
      audioRef.current.play().catch((error) => {
        if (error.name === "NotAllowedError") {
          console.log("Playback prevented. Waiting for user interaction.");
        } else {
          console.warn("Playback error:", error);
        }
        dispatch({ type: "PAUSE" });
      });
    } else {
      audioRef.current.pause();
    }
  }, [state.isPlaying]);

  // Handle volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  const audioControls = {
    seek: (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
      }
    },
    setVolume: (volume: number) => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    },
  };

  const value = {
    state,
    dispatch,
    audioControls,
  };

  return (
    <SonorityContext.Provider value={value}>
      {children}
      {state.currentTrack && (
        <audio
          ref={audioRef}
          src={state.currentTrack.src}
          preload="metadata"
        />
      )}
    </SonorityContext.Provider>
  );
};

export const useSonority = () => {
  const context = useContext(SonorityContext);
  if (!context) {
    throw new Error("useSonority must be used within a SonorityProvider");
  }
  return context;
};

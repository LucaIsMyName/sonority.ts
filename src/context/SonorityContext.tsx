import React, { createContext, useContext, useReducer, useRef, useEffect, useMemo } from "react";
import type { TrackProps, PlaylistProps } from "../types";
import { audioManager } from "../utils/audioManager";

interface SonorityState {
  currentTrack: TrackProps | null;
  currentPlaylist: PlaylistProps | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  previousVolume: number;
  isMuted: boolean;
  playbackRate: number;
  isShuffled: boolean;
  isRepeating: boolean;
  isRepeatingOne: boolean;
  queue: TrackProps[];
}

interface AudioControls {
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
}

interface SonorityContextValue {
  state: SonorityState;
  dispatch: React.Dispatch<SonorityAction>;
  audioControls: AudioControls;
}

const initialState = {
  currentTrack: null,
  currentPlaylist: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  previousVolume: 1,
  isMuted: false,
  isShuffled: false,
  isRepeating: false,
  isRepeatingOne: false,
  playbackRate: 1,
  queue: [],
};

const SonorityContext = createContext<SonorityContextValue | null>(null);

export function useSonoritySelector<Selected>(selector: (state: SonorityState) => Selected, equalityFn: (a: Selected, b: Selected) => boolean = Object.is): Selected {
  const context = useContext(SonorityContext);
  if (!context) throw new Error("useSonoritySelector must be used within SonorityProvider");

  const { state } = context;
  return useMemo(() => selector(state), [selector(state)]);
}

export const usePlaybackState = () => {
  return useSonoritySelector((state) => ({
    currentTime: state.currentTime,
    duration: state.duration,
  }));
};

export const useTrackInfo = () => {
  return useSonoritySelector((state) => ({
    currentTrack: state.currentTrack,
    isPlaying: state.isPlaying,
  }));
};

export const useVolumeState = () => {
  return useSonoritySelector((state) => ({
    volume: state.volume,
    isMuted: state.isMuted,
    previousVolume: state.previousVolume,
  }));
};

export const usePlaylistState = () => {
  return useSonoritySelector((state) => ({
    currentPlaylist: state.currentPlaylist,
    queue: state.queue,
    isShuffled: state.isShuffled,
  }));
};

export const usePlaybackControls = () => {
  const context = useContext(SonorityContext);
  if (!context) throw new Error("usePlaybackControls must be used within SonorityProvider");
  const { dispatch, audioControls } = context;
  return { dispatch, audioControls };
};

type SonorityAction = { type: "SET_TRACK"; payload: TrackProps } | { type: "SET_PLAYLIST"; payload: PlaylistProps } | { type: "PLAY" } | { type: "PAUSE" } | { type: "SET_VOLUME"; payload: number } | { type: "SET_TIME"; payload: number } | { type: "SET_DURATION"; payload: number } | { type: "TOGGLE_SHUFFLE" } | { type: "TOGGLE_REPEAT" } | { type: "TOGGLE_REPEAT_ONE" } | { type: "NEXT_TRACK" } | { type: "PREVIOUS_TRACK" } | { type: "SET_QUEUE"; payload: TrackProps[] } | { type: "TOGGLE_MUTE" } | { type: "SET_MUTED"; payload: boolean } | { type: "SET_PLAYBACK_RATE"; payload: number };

const sonorityReducer = (state: SonorityState, action: SonorityAction): SonorityState => {
  switch (action.type) {
    case "SET_TRACK": {
      // Keep track in the context of current playlist/queue
      return {
        ...state,
        currentTrack: action.payload,
        currentTime: 0,
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

    case "SET_PLAYLIST": {
      const newTracks = action.payload.tracks || [];
      // Keep current track if it exists in new playlist
      const currentTrackInNewPlaylist = newTracks.find((track) => track.id === state.currentTrack?.id);

      return {
        ...state,
        currentPlaylist: action.payload,
        queue: newTracks,
        currentTrack: currentTrackInNewPlaylist || state.currentTrack,
        isShuffled: false,
      };
    }
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
    case "SET_QUEUE": {
      const newQueue = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        queue: newQueue,
      };
    }
    case "NEXT_TRACK": {
      if (!state.queue.length) return state;

      const currentIndex = state.queue.findIndex((track) => track.id === state.currentTrack?.id);
      const nextIndex = currentIndex + 1 >= state.queue.length ? 0 : currentIndex + 1;

      return {
        ...state,
        currentTrack: state.queue[nextIndex],
        currentTime: 0,
      };
    }

    case "PREVIOUS_TRACK": {
      if (!state.queue.length) return state;

      const currentIndex = state.queue.findIndex((track) => track.id === state.currentTrack?.id);
      const prevIndex = currentIndex <= 0 ? state.queue.length - 1 : currentIndex - 1;

      return {
        ...state,
        currentTrack: state.queue[prevIndex],
        currentTime: 0,
      };
    }
    case "TOGGLE_MUTE":
      if (state.isMuted) {
        // Unmuting - restore previous volume
        return {
          ...state,
          isMuted: false,
          volume: state.previousVolume,
        };
      } else {
        return {
          ...state,
          isMuted: true,
          previousVolume: state.volume,
          volume: 0,
        };
      }
    case "SET_MUTED":
      return {
        ...state,
        isMuted: action.payload,
        volume: action.payload ? 0 : state.previousVolume,
      };
    case "SET_PLAYBACK_RATE":
      return {
        ...state,
        playbackRate: action.payload,
      };
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
    setPlaybackRate: (rate: number) => {
      if (audioRef.current) {
        audioRef.current.playbackRate = rate;
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

import React6, { createContext, useEffect, memo, useContext, useReducer, useRef, useMemo, useState } from 'react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as Slider from '@radix-ui/react-slider';

// src/context/SonorityContext.tsx

// src/utils/audioManager.ts
var AudioManager = class _AudioManager {
  constructor() {
    this.currentPlayerId = null;
    this.callbacks = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    if (!_AudioManager.instance) {
      _AudioManager.instance = new _AudioManager();
    }
    return _AudioManager.instance;
  }
  registerPlayer(playerId, pauseCallback) {
    this.callbacks.set(playerId, pauseCallback);
  }
  unregisterPlayer(playerId) {
    this.callbacks.delete(playerId);
  }
  notifyPlayStarted(playerId) {
    if (this.currentPlayerId && this.currentPlayerId !== playerId) {
      const pauseCallback = this.callbacks.get(this.currentPlayerId);
      if (pauseCallback) {
        pauseCallback();
      }
    }
    this.currentPlayerId = playerId;
  }
};
var audioManager = AudioManager.getInstance();
var initialState = {
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
  queue: []
};
var SonorityContext = createContext(null);
function useSonoritySelector(selector, equalityFn = Object.is) {
  const context = useContext(SonorityContext);
  if (!context)
    throw new Error("useSonoritySelector must be used within SonorityProvider");
  const { state } = context;
  return useMemo(() => selector(state), [selector(state)]);
}
var useTrackInfo = () => {
  return useSonoritySelector((state) => ({
    currentTrack: state.currentTrack,
    isPlaying: state.isPlaying
  }));
};
var usePlaybackControls = () => {
  const context = useContext(SonorityContext);
  if (!context)
    throw new Error("usePlaybackControls must be used within SonorityProvider");
  const { dispatch, audioControls } = context;
  return { dispatch, audioControls };
};
var sonorityReducer = (state, action) => {
  var _a;
  switch (action.type) {
    case "SET_TRACK": {
      return {
        ...state,
        currentTrack: action.payload,
        currentTime: 0
      };
    }
    case "TOGGLE_SHUFFLE":
      return {
        ...state,
        isShuffled: !state.isShuffled,
        queue: state.isShuffled ? [...state.queue].sort(() => Math.random() - 0.5) : ((_a = state.currentPlaylist) == null ? void 0 : _a.tracks) || state.queue
        // Restore original order
      };
    case "TOGGLE_REPEAT":
      return {
        ...state,
        isRepeating: !state.isRepeating,
        isRepeatingOne: false
        // Disable repeat one when toggling repeat
      };
    case "TOGGLE_REPEAT_ONE":
      return {
        ...state,
        isRepeatingOne: !state.isRepeatingOne,
        isRepeating: false
        // Disable repeat all when toggling repeat one
      };
    case "SET_PLAYLIST":
      return {
        ...state,
        currentPlaylist: action.payload,
        queue: action.payload.tracks || []
        // Update queue when playlist changes
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
      const currentIndex = state.queue.findIndex((track) => {
        var _a2;
        return track.id === ((_a2 = state.currentTrack) == null ? void 0 : _a2.id);
      });
      const nextIndex = currentIndex + 1 >= state.queue.length ? 0 : currentIndex + 1;
      return {
        ...state,
        currentTrack: state.queue[nextIndex] || state.currentTrack,
        currentTime: 0,
        isPlaying: state.isPlaying
        // Maintain play state when changing tracks
      };
    }
    case "PREVIOUS_TRACK": {
      const currentIndex = state.queue.findIndex((track) => {
        var _a2;
        return track.id === ((_a2 = state.currentTrack) == null ? void 0 : _a2.id);
      });
      const prevIndex = currentIndex <= 0 ? state.queue.length - 1 : currentIndex - 1;
      return {
        ...state,
        currentTrack: state.queue[prevIndex] || state.currentTrack,
        currentTime: 0,
        isPlaying: state.isPlaying
        // Maintain play state when changing tracks
      };
    }
    case "TOGGLE_MUTE":
      if (state.isMuted) {
        return {
          ...state,
          isMuted: false,
          volume: state.previousVolume
        };
      } else {
        return {
          ...state,
          isMuted: true,
          previousVolume: state.volume,
          volume: 0
        };
      }
    case "SET_MUTED":
      return {
        ...state,
        isMuted: action.payload,
        volume: action.payload ? 0 : state.previousVolume
      };
    case "SET_PLAYBACK_RATE":
      return {
        ...state,
        playbackRate: action.payload
      };
    default:
      return state;
  }
};
var SonorityProvider = ({ children, id = crypto.randomUUID() }) => {
  var _a;
  const [state, dispatch] = useReducer(sonorityReducer, initialState);
  const audioRef = useRef(null);
  const playerIdRef = useRef(id);
  useEffect(() => {
    audioManager.registerPlayer(playerIdRef.current, () => {
      dispatch({ type: "PAUSE" });
    });
    return () => {
      audioManager.unregisterPlayer(playerIdRef.current);
    };
  }, []);
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = "auto";
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
    if (!audioRef.current)
      return;
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
  useEffect(() => {
    if (!audioRef.current || !state.currentTrack)
      return;
    const audio = audioRef.current;
    const setupNewTrack = () => {
      var _a2;
      audio.src = ((_a2 = state.currentTrack) == null ? void 0 : _a2.src) || "";
      audio.load();
      if (state.isPlaying) {
        audio.play().catch((error) => {
          console.log("Playback prevented:", error);
          dispatch({ type: "PAUSE" });
        });
      }
    };
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
        const currentIndex = state.queue.findIndex((track) => {
          var _a2;
          return track.id === ((_a2 = state.currentTrack) == null ? void 0 : _a2.id);
        });
        const nextIndex = (currentIndex + 1) % state.queue.length;
        dispatch({
          type: "SET_TRACK",
          payload: state.queue[nextIndex]
        });
      } else if (state.queue.length > 0) {
        dispatch({ type: "NEXT_TRACK" });
      } else {
        dispatch({ type: "PAUSE" });
      }
    };
    const handleError = (e) => {
      console.warn("Audio error:", e);
      audio.load();
    };
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    setupNewTrack();
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [(_a = state.currentTrack) == null ? void 0 : _a.id]);
  useEffect(() => {
    if (!audioRef.current || !state.currentTrack)
      return;
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
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);
  const audioControls = {
    seek: (time) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
      }
    },
    setVolume: (volume) => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    },
    setPlaybackRate: (rate) => {
      if (audioRef.current) {
        audioRef.current.playbackRate = rate;
      }
    }
  };
  const value = {
    state,
    dispatch,
    audioControls
  };
  return /* @__PURE__ */ jsxs(SonorityContext.Provider, { value, children: [
    children,
    state.currentTrack && /* @__PURE__ */ jsx(
      "audio",
      {
        ref: audioRef,
        src: state.currentTrack.src,
        preload: "metadata"
      }
    )
  ] });
};
var useSonority = () => {
  const context = useContext(SonorityContext);
  if (!context) {
    throw new Error("useSonority must be used within a SonorityProvider");
  }
  return context;
};
var VolumeGraph = ({ width, height, stroke = "#707070", strokeWidth = 1, strokeLineCap = "round", gap = 22, className, trackId }) => {
  const { state } = useSonority();
  const defaultWidth = 404;
  const defaultHeight = 211;
  const volumeData = useMemo(() => {
    var _a;
    const counts = Math.floor((width || defaultWidth) / gap);
    const isCurrent = trackId === ((_a = state.currentTrack) == null ? void 0 : _a.id);
    return Array.from({ length: counts }, () => isCurrent ? Math.random() * 0.8 + 0.4 : Math.random() * 0.6 + 0.2);
  }, []);
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: width || "100%",
      height: height || "100%",
      viewBox: `0 0 ${defaultWidth} ${defaultHeight}`,
      preserveAspectRatio: "xMidYMid meet",
      className,
      children: /* @__PURE__ */ jsx("g", { children: volumeData.map((volume, index) => {
        const x = gap + index * gap;
        const lineHeight = volume * defaultHeight * 0.6;
        const y1 = (defaultHeight - lineHeight) / 2;
        const y2 = y1 + lineHeight;
        return /* @__PURE__ */ jsx(
          "line",
          {
            x1: x,
            y1,
            x2: x,
            y2,
            stroke,
            strokeWidth,
            strokeLinecap: strokeLineCap
          },
          index
        );
      }) })
    }
  );
};
var CurrentContext = createContext(null);
var CurrentContextProvider = ({ children, className }) => {
  const { state } = useSonority();
  const contextValue = {
    currentTrack: state.currentTrack
  };
  return /* @__PURE__ */ jsx(CurrentContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx("div", { className, children }) });
};
var Current = Object.assign(({ children, className }) => /* @__PURE__ */ jsx(CurrentContextProvider, { className, children: children || /* @__PURE__ */ jsx(Current.Track, {}) }), {
  Provider: CurrentContextProvider
});
var useCurrentContext = () => {
  const context = useContext(CurrentContext);
  if (!context) {
    const { state } = useSonority();
    return { currentTrack: state.currentTrack };
  }
  return context;
};
var createSubcomponent = (propName, defaultRenderer) => {
  return ({ className, children }) => {
    const { currentTrack } = useCurrentContext();
    if (children)
      return /* @__PURE__ */ jsx(
        "div",
        {
          "data-sonority-component": `Current.${propName}`,
          className,
          children
        }
      );
    if (defaultRenderer && currentTrack) {
      const renderedContent = defaultRenderer(currentTrack);
      return renderedContent ? /* @__PURE__ */ jsx(
        "div",
        {
          "data-sonority-component": `Current.${propName}`,
          className,
          children: renderedContent
        }
      ) : null;
    }
    return currentTrack && currentTrack[propName] ? /* @__PURE__ */ jsx(
      "div",
      {
        "data-sonority-component": `Current.${propName}`,
        className,
        children: currentTrack[propName]
      }
    ) : null;
  };
};
Current.Cover = createSubcomponent(
  "image",
  (track) => track.image ? /* @__PURE__ */ jsx(
    "img",
    {
      src: track.image.src,
      alt: track.image.alt || "Album Cover",
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }
    }
  ) : null
);
Current.VolumeGraph = ({ className, ...props }) => {
  const { currentTrack } = useCurrentContext();
  if (!currentTrack)
    return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-sonority-component": "Current.VolumeGraph",
      className,
      children: /* @__PURE__ */ jsx(
        VolumeGraph,
        {
          ...props,
          trackId: currentTrack.id
        }
      )
    }
  );
};
Current.Track = createSubcomponent("title");
Current.Artist = createSubcomponent("artist");
Current.Album = createSubcomponent("album");
Current.WrittenBy = createSubcomponent("writtenBy");
Current.Copyright = createSubcomponent("copyright");
Current.Genre = createSubcomponent("genre");
Current.Year = createSubcomponent("year");
Current.Duration = createSubcomponent("duration");
Current.CurrentTime = createSubcomponent("currentTime");
var ControlContext = createContext(null);
var ControlContextProvider = ({ children, className }) => {
  const { state, dispatch, audioControls } = useSonority();
  const contextValue = {
    state,
    dispatch,
    audioControls
  };
  return /* @__PURE__ */ jsx(ControlContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(
    "div",
    {
      "data-sonority-component": "control",
      className,
      children
    }
  ) });
};
var Control = Object.assign(({ children, className }) => /* @__PURE__ */ jsx(ControlContextProvider, { className, children }), {
  Provider: ControlContextProvider
});
var useControlContext = () => {
  const context = useContext(ControlContext);
  if (!context) {
    const { state, dispatch, audioControls } = useSonority();
    return { state, dispatch, audioControls };
  }
  return context;
};
Control.Play = ({ className, children }) => {
  const { state, dispatch } = useControlContext();
  const handlePlayPause = () => {
    if (!state.currentTrack && state.queue.length > 0) {
      dispatch({
        type: "SET_TRACK",
        payload: state.queue[0]
      });
    }
    dispatch({ type: state.isPlaying ? "PAUSE" : "PLAY" });
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      "data-sonority-component": `Control.Play`,
      onClick: handlePlayPause,
      className,
      children: children || (state.isPlaying ? "Pause" : "Play")
    }
  );
};
Control.Previous = ({ className, children }) => {
  const { state, dispatch } = useControlContext();
  return /* @__PURE__ */ jsx(
    "button",
    {
      "data-sonority-component": `Control.Previous`,
      onClick: () => dispatch({ type: "PREVIOUS_TRACK" }),
      className,
      disabled: state.queue.length <= 1,
      children: children || "Previous"
    }
  );
};
Control.Next = ({ className, children }) => {
  const { state, dispatch } = useControlContext();
  return /* @__PURE__ */ jsx(
    "button",
    {
      "data-sonority-component": `Control.Next`,
      onClick: () => dispatch({ type: "NEXT_TRACK" }),
      className,
      "data-sonority-next": state.queue.length <= 1,
      disabled: state.queue.length <= 1,
      children: children || "Next"
    }
  );
};
Control.Seek = ({ className, children }) => {
  const { state, dispatch, audioControls } = useControlContext();
  return /* @__PURE__ */ jsxs(
    Slider.Root,
    {
      "data-sonority-component": `Control.Seek`,
      style: {
        width: "100%",
        height: "10px",
        position: "relative",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        touchAction: "none",
        userSelect: "none"
      },
      value: [state.currentTime],
      onValueChange: (value) => {
        if ((audioControls == null ? void 0 : audioControls.seek) && value.length > 0) {
          audioControls.seek(value[0]);
          dispatch({ type: "SET_TIME", payload: value[0] });
        }
      },
      max: state.duration || 0,
      step: 0.1,
      children: [
        /* @__PURE__ */ jsx(
          Slider.Track,
          {
            style: {
              position: "relative",
              flexGrow: 1,
              height: "2px",
              backgroundColor: "currentColor",
              borderRadius: "9999px"
            },
            children: /* @__PURE__ */ jsx(
              Slider.Range,
              {
                style: {
                  position: "absolute",
                  height: "100%",
                  backgroundColor: "currentColor",
                  borderRadius: "9999px",
                  left: 0,
                  right: 0
                }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Slider.Thumb,
          {
            style: {
              display: "block",
              width: "12px",
              height: "12px",
              minHeight: "12px",
              minWidth: "12px",
              backgroundColor: "rgba(0,0,0,1)",
              border: "2px solid currentColor",
              outline: "none",
              borderRadius: "9999px",
              transition: "background-color 0.2s, left 0.1s"
            },
            "aria-label": "Seek"
          }
        )
      ]
    }
  );
};
Control.Mute = ({ className, children, initialMuted = false }) => {
  const { state, dispatch } = useControlContext();
  useEffect(() => {
    if (initialMuted) {
      dispatch({ type: "SET_MUTED", payload: true });
    }
  }, []);
  const handleMute = () => {
    dispatch({ type: "TOGGLE_MUTE" });
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      "data-sonority-component": `Control.Mute`,
      onClick: handleMute,
      className,
      "aria-label": state.isMuted ? "Unmute" : "Mute",
      title: state.isMuted ? "Unmute" : "Mute",
      children: children || (state.isMuted ? "Unmute" : "Mute")
    }
  );
};
Control.Speed = ({ className, options = {}, children }) => {
  var _a, _b, _c, _d;
  const { state, dispatch, audioControls } = useControlContext();
  const { min = 0, max = 2, default: defaultValue = 1, steps = 0.5, variant = "range" } = options;
  const speeds = React6.useMemo(() => {
    const count = (max - min) / steps + 1;
    return Array.from({ length: count }, (_, i) => min + i * steps);
  }, [min, max, steps]);
  const handleSpeedChange = (speed) => {
    dispatch({ type: "SET_PLAYBACK_RATE", payload: speed });
    if (audioControls == null ? void 0 : audioControls.setPlaybackRate) {
      audioControls.setPlaybackRate(speed);
    }
  };
  if (variant === "buttons" && typeof children === "function") {
    return children({
      speeds,
      currentSpeed: (_a = state.playbackRate) != null ? _a : defaultValue,
      setSpeed: handleSpeedChange
    });
  }
  if (variant === "range") {
    return /* @__PURE__ */ jsxs(
      Slider.Root,
      {
        style: {
          width: "100%",
          height: "10px",
          position: "relative",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          touchAction: "none",
          userSelect: "none"
        },
        "data-sonority-component": `Control.Speed?variant=range`,
        value: [(_b = state.playbackRate) != null ? _b : defaultValue],
        min,
        max,
        step: steps,
        onValueChange: ([value]) => handleSpeedChange(value),
        className,
        children: [
          /* @__PURE__ */ jsx(
            Slider.Track,
            {
              style: {
                position: "relative",
                flexGrow: 1,
                height: "2px",
                backgroundColor: "currentColor",
                borderRadius: "9999px"
              },
              children: /* @__PURE__ */ jsx(
                Slider.Range,
                {
                  style: {
                    position: "absolute",
                    height: "100%",
                    backgroundColor: "currentColor",
                    borderRadius: "9999px"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            Slider.Thumb,
            {
              style: {
                display: "block",
                width: "12px",
                height: "12px",
                minHeight: "12px",
                minWidth: "12px",
                backgroundColor: "rgba(0,0,0,1)",
                border: "2px solid currentColor",
                outline: "none",
                borderRadius: "9999px",
                transition: "background-color 0.2s, left 0.1s"
              },
              "aria-label": "Speed"
            }
          )
        ]
      }
    );
  }
  if (variant === "select") {
    return /* @__PURE__ */ jsx(
      "select",
      {
        "data-sonority-component": `Control.Speed?variant=select`,
        className,
        value: (_c = state.playbackRate) != null ? _c : defaultValue,
        onChange: (e) => handleSpeedChange(Number(e.target.value)),
        children: speeds.map((speed) => /* @__PURE__ */ jsxs(
          "option",
          {
            value: speed,
            children: [
              speed,
              "x"
            ]
          },
          speed
        ))
      }
    );
  }
  if (variant === "buttons") {
    if (typeof children === "function") {
      return children({
        speeds,
        currentSpeed: (_d = state.playbackRate) != null ? _d : defaultValue,
        setSpeed: handleSpeedChange
      });
    }
    return /* @__PURE__ */ jsx("div", { className: `flex gap-2 ${className}`, children: speeds.map((speed) => {
      var _a2;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          "data-sonority-component": `Control.Speed?variant=buttons`,
          onClick: () => handleSpeedChange(speed),
          className: `px-2 py-1 rounded ${((_a2 = state.playbackRate) != null ? _a2 : defaultValue) === speed ? "bg-blue-500 text-white" : "bg-gray-200"}`,
          children: [
            speed,
            "x"
          ]
        },
        speed
      );
    }) });
  }
  return null;
};
Control.Volume = ({ className }) => {
  const { state, dispatch, audioControls } = useControlContext();
  return /* @__PURE__ */ jsxs(
    Slider.Root,
    {
      "data-sonority-component": `Control.Volume`,
      className,
      style: {
        width: "100%",
        height: "10px",
        position: "relative",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        touchAction: "none",
        userSelect: "none"
      },
      value: [state.volume],
      max: 1,
      step: 0.01,
      onValueChange: (value) => {
        if (value.length > 0) {
          dispatch({ type: "SET_VOLUME", payload: value[0] });
          audioControls.setVolume(value[0]);
        }
      },
      children: [
        /* @__PURE__ */ jsx(
          Slider.Track,
          {
            style: {
              position: "relative",
              flexGrow: 1,
              height: "2px",
              backgroundColor: "currentColor",
              borderRadius: "9999px"
            },
            children: /* @__PURE__ */ jsx(
              Slider.Range,
              {
                style: {
                  position: "absolute",
                  height: "100%",
                  backgroundColor: "currentColor",
                  borderRadius: "9999px",
                  left: 0,
                  right: 0
                }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Slider.Thumb,
          {
            style: {
              display: "block",
              width: "12px",
              height: "12px",
              minHeight: "12px",
              minWidth: "12px",
              backgroundColor: "rgba(0,0,0,1)",
              border: "2px solid currentColor",
              outline: "none",
              borderRadius: "9999px",
              transition: "background-color 0.2s, left 0.1s"
            },
            "aria-label": "Volume"
          }
        )
      ]
    }
  );
};
Control.Shuffle = ({ className, children }) => {
  const { state, dispatch } = useControlContext();
  return /* @__PURE__ */ jsx(
    "button",
    {
      "data-sonority-component": `Control.Shuffle`,
      onClick: () => dispatch({ type: "TOGGLE_SHUFFLE" }),
      className,
      children: children || "Shuffle"
    }
  );
};
Control.Repeat = ({ className, children }) => {
  const { state, dispatch } = useControlContext();
  const handleRepeat = () => {
    if (!state.isRepeating && !state.isRepeatingOne) {
      dispatch({ type: "TOGGLE_REPEAT" });
    } else if (state.isRepeating) {
      dispatch({ type: "TOGGLE_REPEAT" });
      dispatch({ type: "TOGGLE_REPEAT_ONE" });
    } else if (state.isRepeatingOne) {
      dispatch({ type: "TOGGLE_REPEAT_ONE" });
    }
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      "data-sonority-component": `Control.Repeat`,
      onClick: handleRepeat,
      className,
      children: children || "Repeat"
    }
  );
};
var TrackContext = createContext(null);
var Track2 = memo(
  ({
    className,
    title,
    artist,
    writtenBy,
    album,
    image,
    src,
    id,
    onClick,
    children,
    coverWidth = 32,
    coverClassName = "",
    genre,
    year,
    duration,
    copyright,
    ...props
  }) => {
    const { currentTrack } = useTrackInfo();
    const { dispatch } = usePlaybackControls();
    const isCurrentTrack = (currentTrack == null ? void 0 : currentTrack.id) === id;
    const handleTrackClick = () => {
      dispatch({
        type: "SET_TRACK",
        payload: {
          id,
          title,
          artist,
          writtenBy,
          album,
          image,
          src,
          copyright,
          genre,
          year,
          duration,
          ...props
        }
      });
      onClick == null ? void 0 : onClick();
    };
    const contextValue = {
      title,
      artist,
      writtenBy,
      album,
      image,
      copyright,
      src,
      id,
      genre,
      year,
      duration,
      ...props
    };
    return /* @__PURE__ */ jsx(TrackContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(
      "button",
      {
        "data-sonority-component": "Track",
        "data-sonority-current": isCurrentTrack,
        className,
        onClick: handleTrackClick,
        children: children || /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Track2.Cover, {}),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Track2.Title, {}),
            /* @__PURE__ */ jsx(Track2.Artist, {}),
            writtenBy && /* @__PURE__ */ jsx(Track2.WrittenBy, {}),
            copyright && /* @__PURE__ */ jsxs("p", { children: [
              "\xA9 ",
              /* @__PURE__ */ jsx(Track2.Copyright, {})
            ] }),
            album && /* @__PURE__ */ jsx(Track2.Album, {})
          ] })
        ] })
      }
    ) });
  }
);
var useTrackContext = () => {
  const context = useContext(TrackContext);
  if (!context) {
    throw new Error("Track components must be rendered inside a Track component");
  }
  return context;
};
var formatDuration = (duration) => {
  if (!duration)
    return "";
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
Track2.Title = memo(({ className, children }) => {
  const track = useTrackContext();
  return /* @__PURE__ */ jsx(
    "span",
    {
      "data-sonority-component": "Track.Title",
      className,
      style: { textAlign: "start" },
      children: children || track.title
    }
  );
});
Track2.Artist = memo(({ className, children }) => {
  const track = useTrackContext();
  if (children)
    return /* @__PURE__ */ jsx("p", { className, children });
  return track.artist ? /* @__PURE__ */ jsx("p", { className, children: track.artist }) : null;
});
Track2.WrittenBy = memo(({ className, children }) => {
  const track = useTrackContext();
  return /* @__PURE__ */ jsx(
    "span",
    {
      "data-sonority-component": "Track.WrittenBy",
      className,
      children: children || track.writtenBy
    }
  );
});
Track2.VolumeGraph = ({ className, ...props }) => {
  const track = useTrackContext();
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-sonority-component": "Track.VolumeGraph",
      className,
      children: /* @__PURE__ */ jsx(
        VolumeGraph,
        {
          ...props,
          trackId: track.id
        }
      )
    }
  );
};
Track2.Album = memo(({ className, children }) => {
  const track = useTrackContext();
  return track.album ? /* @__PURE__ */ jsx(
    "span",
    {
      "data-sonority-component": "Track.Album",
      className,
      children: children || track.album
    }
  ) : null;
});
Track2.Genre = ({ className, children }) => {
  const track = useTrackContext();
  if (children)
    return /* @__PURE__ */ jsx(
      "span",
      {
        "data-sonority-component": `Track.Genre`,
        className,
        children
      }
    );
  return track.genre ? /* @__PURE__ */ jsx(
    "span",
    {
      "data-sonority-component": `Track.Genre`,
      className,
      children: track.genre
    }
  ) : null;
};
Track2.Year = ({ className, children }) => {
  const track = useTrackContext();
  if (children)
    return /* @__PURE__ */ jsx(
      "span",
      {
        "data-sonority-component": `Track.Year`,
        className,
        children
      }
    );
  return track.year ? /* @__PURE__ */ jsx(
    "span",
    {
      "data-sonority-component": `Track.Year`,
      className,
      children: track.year
    }
  ) : null;
};
Track2.Duration = ({ className, children }) => {
  const track = useTrackContext();
  if (children)
    return /* @__PURE__ */ jsx(
      "span",
      {
        "data-sonority-component": `Track.Duration`,
        className,
        children
      }
    );
  return track.duration ? /* @__PURE__ */ jsx(
    "span",
    {
      "data-sonority-component": `Track.Duration`,
      className,
      children: formatDuration(track.duration)
    }
  ) : null;
};
Track2.CurrentTime = ({ className, children }) => {
  const track = useTrackContext();
  if (children)
    return /* @__PURE__ */ jsx(
      "p",
      {
        "data-sonority-component": `Track.CurrentTime`,
        className,
        children
      }
    );
  return track.currentTime ? /* @__PURE__ */ jsx(
    "span",
    {
      "data-sonority-component": `Track.CurrentTime`,
      className,
      children: formatDuration(track.currentTime)
    }
  ) : null;
};
Track2.Cover = memo(({ className, imgClassName, altClassName }) => {
  const track = useTrackContext();
  return track.image ? /* @__PURE__ */ jsxs("figure", { className, children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        "data-sonority-component": "Track.Cover",
        src: track.image.src,
        alt: track.image.alt || track.title,
        className: imgClassName,
        style: {
          minWidth: "100%",
          minHeight: "100%",
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }
      }
    ),
    track.image.alt && /* @__PURE__ */ jsx(
      "figcaption",
      {
        hidden: true,
        className: altClassName,
        children: track.image.alt
      }
    )
  ] }) : null;
});
Track2.CustomProperty = ({ name, className, children }) => {
  const track = useTrackContext();
  const propertyValue = track[name];
  if (children)
    return /* @__PURE__ */ jsx(
      "p",
      {
        "data-sonority-component": `Track.CustomProperty`,
        className,
        children
      }
    );
  return propertyValue ? /* @__PURE__ */ jsxs(
    "p",
    {
      className,
      "data-sonority-component": `Track.CustomProperty`,
      children: [
        name,
        ": ",
        propertyValue.toString()
      ]
    }
  ) : null;
};
var Playlist = ({ name, id, children, className }) => {
  const { dispatch, state } = useSonority();
  useEffect(() => {
    const trackElements = React6.Children.toArray(children).filter((child) => React6.isValidElement(child) && child.type === Track2);
    const extractedTracks = trackElements.map((track) => ({
      ...track.props,
      id: track.props.id || crypto.randomUUID()
    }));
    dispatch({
      type: "SET_PLAYLIST",
      payload: {
        id,
        name,
        tracks: extractedTracks
      }
    });
    if (!state.currentTrack && extractedTracks.length > 0) {
      dispatch({
        type: "SET_TRACK",
        payload: extractedTracks[0]
      });
    }
  }, [id, name]);
  const handleTrackSelect = (trackProps) => {
    dispatch({
      type: "SET_TRACK",
      payload: trackProps
    });
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-sonority-component": "Playlist",
      "data-sonority-playlist-id": id,
      "data-sonority-playlist-name": name,
      className,
      children: React6.Children.map(children, (child) => {
        if (React6.isValidElement(child) && child.type === Track2) {
          return React6.cloneElement(child, {
            ...child.props,
            onClick: () => handleTrackSelect(child.props)
          });
        }
        return child;
      })
    }
  );
};
var Visualizer = ({ variant = "bars", className = "", width = 300, height = 150, color = "#4ade80" }) => {
  const canvasRef = useRef(null);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [dataArray, setDataArray] = useState(null);
  const animationFrameRef = useRef();
  useEffect(() => {
    const initAudio = async () => {
      var _a;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyzerNode = audioCtx.createAnalyser();
      analyzerNode.fftSize = 256;
      try {
        const { state } = useSonority();
        const audioElement = document.querySelector(`[data-sonority-audio=${(_a = state.currentTrack) == null ? void 0 : _a.src}]`);
        if (audioElement) {
          const source = audioCtx.createMediaElementSource(audioElement);
          source.connect(analyzerNode);
          analyzerNode.connect(audioCtx.destination);
        }
      } catch (error) {
        console.error("Error connecting to audio source:", error);
      }
      setAudioContext(audioCtx);
      setAnalyser(analyzerNode);
      setDataArray(new Uint8Array(analyzerNode.frequencyBinCount));
    };
    initAudio();
    return () => {
      if (audioContext) {
        audioContext.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  const drawBars = (ctx, data) => {
    const barWidth = width / data.length;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < data.length; i++) {
      const barHeight = data[i] / 255 * height;
      ctx.fillStyle = color;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
    }
  };
  const drawWaves = (ctx, data) => {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    for (let i = 0; i < data.length; i++) {
      const x = i / data.length * width;
      const y = data[i] / 255 * height / 2 + height / 4;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };
  const drawCircle = (ctx, data) => {
    ctx.clearRect(0, 0, width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const angle = i / data.length * Math.PI * 2;
      const amplitude = data[i] / 255 * radius;
      const x = centerX + (radius + amplitude) * Math.cos(angle);
      const y = centerY + (radius + amplitude) * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };
  const drawLines = (ctx, data) => {
    ctx.clearRect(0, 0, width, height);
    const lineSpacing = width / (data.length - 1);
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = i * lineSpacing;
      const amplitude = data[i] / 255 * height;
      ctx.moveTo(x, height);
      ctx.lineTo(x, height - amplitude);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };
  const drawEqualizer = (ctx, data) => {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / 32;
    const smoothedData = new Array(32).fill(0);
    for (let i = 0; i < 32; i++) {
      const dataIndex = Math.floor(i / 32 * data.length);
      smoothedData[i] = data[dataIndex];
    }
    for (let i = 0; i < 32; i++) {
      const barHeight = smoothedData[i] / 255 * height;
      const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color + "44");
      ctx.fillStyle = gradient;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
    }
  };
  useEffect(() => {
    if (!analyser || !canvasRef.current)
      return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx)
      return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const draw = () => {
      analyser.getByteFrequencyData(data);
      switch (variant) {
        case "waves":
          drawWaves(ctx, data);
          break;
        case "lines":
          drawLines(ctx, data);
          break;
        case "circle":
          drawCircle(ctx, data);
          break;
        case "equalizer":
          drawEqualizer(ctx, data);
          break;
        case "bars":
        default:
          drawBars(ctx, data);
          break;
      }
      animationFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, variant, color, width, height]);
  return /* @__PURE__ */ jsx(
    "canvas",
    {
      "data-sonority-component": `Visualizer?is=${variant == null ? void 0 : variant.toString()}`,
      ref: canvasRef,
      width,
      height,
      className
    }
  );
};
var SonorityBase = ({ variant = "single", className, children }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-sonority-component": "player",
      "data-sonority-variant": variant,
      className,
      children
    }
  );
};
var Sonority = Object.assign(
  ({ variant, className, children }) => /* @__PURE__ */ jsx(SonorityProvider, { id: true, children: /* @__PURE__ */ jsx(
    SonorityBase,
    {
      "data-sonority-component": `Root`,
      variant,
      className,
      children
    }
  ) }),
  {
    Current,
    Control,
    Playlist,
    Track: Track2,
    Visualizer
  }
);

// src/utils.ts
var createPlaylist = (tracks, name) => ({
  id: crypto.randomUUID(),
  name,
  tracks
});
var mergePlaylists = (playlists) => ({
  id: crypto.randomUUID(),
  name: "Merged Playlist",
  tracks: playlists.flatMap((playlist) => playlist.tracks || [])
});
var filterPlaylist = (playlist, predicate) => {
  var _a;
  return {
    ...playlist,
    tracks: ((_a = playlist.tracks) == null ? void 0 : _a.filter(predicate)) || []
  };
};
var sortPlaylist = (playlist, order) => {
  var _a;
  return {
    ...playlist,
    tracks: ((_a = playlist.tracks) == null ? void 0 : _a.sort((a, b) => {
      if (order === "asc") {
        return a[order] > b[order] ? 1 : -1;
      }
      if (order === "desc") {
        return a[order] < b[order] ? 1 : -1;
      }
      return 0;
    })) || []
  };
};
var shufflePlaylist = (playlist) => {
  var _a;
  return {
    ...playlist,
    tracks: ((_a = playlist.tracks) == null ? void 0 : _a.sort(() => Math.random() - 0.5)) || []
  };
};
var toggleMute = (audio) => {
  audio.muted = !audio.muted;
};
var toggleLoop = (audio) => {
  audio.loop = !audio.loop;
};
var togglePlaybackRate = (audio) => {
  audio.playbackRate = audio.playbackRate === 1 ? 2 : 1;
};
var toggleControls = (audio) => {
  audio.controls = !audio.controls;
};
var toggleAutoplay = (audio) => {
  audio.autoplay = !audio.autoplay;
};
var stringUtils = {
  toKebab: (str) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase(),
  toPascal: (str) => str.replace(/(\w)(\w*)/g, (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase()),
  toCamel: (str) => str.replace(/(\w)(\w*)/g, (_, g1, g2) => g1.toLowerCase() + g2.toLowerCase()),
  toSnake: (str) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1_$2").toLowerCase(),
  toTitle: (str) => str.replace(/(\w)(\w*)/g, (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase()),
  toSentence: (str) => str.replace(/(\w)(\w*)/g, (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase()),
  toCapital: (str) => str.charAt(0).toUpperCase() + str.slice(1),
  toLower: (str) => str.toLowerCase(),
  toUpper: (str) => str.toUpperCase(),
  toTrim: (str) => str.trim(),
  toReverse: (str) => str.split("").reverse().join(""),
  toReplace: (str, search, replace) => str.replace(new RegExp(search, "g"), replace),
  toSlice: (str, start, end) => str.slice(start, end),
  toSubstring: (str, start, end) => str.substring(start, end),
  toCharAt: (str, index) => str.charAt(index),
  toCharCodeAt: (str, index) => str.charCodeAt(index),
  toCodePointAt: (str, index) => str.codePointAt(index),
  toConcat: (str, ...args) => str.concat(...args),
  toIncludes: (str, search) => str.includes(search),
  toEndsWith: (str, search) => str.endsWith(search),
  toStartsWith: (str, search) => str.startsWith(search),
  toIndexOf: (str, search) => str.indexOf(search),
  toLastIndexOf: (str, search) => str.lastIndexOf(search),
  toMatch: (str, search) => str.match(new RegExp(search, "g")),
  toSearch: (str, search) => str.search(new RegExp(search, "g"))
};
var audioUtils = {
  play: (audio) => audio.play(),
  pause: (audio) => audio.pause(),
  seek: (audio, time) => {
    audio.currentTime = time;
  }
};

// src/index.ts
var src_default = Sonority;

export { Control, Current, Playlist, Sonority, Track2 as Track, Visualizer, audioUtils, createPlaylist, src_default as default, filterPlaylist, mergePlaylists, shufflePlaylist, sortPlaylist, stringUtils, toggleAutoplay, toggleControls, toggleLoop, toggleMute, togglePlaybackRate, useSonority };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map
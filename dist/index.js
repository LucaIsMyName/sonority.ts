import React2, { createContext, useReducer, useRef, useEffect, useContext } from 'react';
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
  isShuffled: false,
  isRepeating: false,
  isRepeatingOne: false,
  queue: []
};
var SonorityContext = createContext(null);
var sonorityReducer = (state, action) => {
  switch (action.type) {
    case "SET_TRACK": {
      return {
        ...state,
        currentTrack: action.payload,
        currentTime: 0
        // Don't change isPlaying state here
      };
    }
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
        var _a;
        return track.id === ((_a = state.currentTrack) == null ? void 0 : _a.id);
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
        var _a;
        return track.id === ((_a = state.currentTrack) == null ? void 0 : _a.id);
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
      } else if (state.isRepeating || state.queue.length > 0) {
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
var CoverComponent = ({ className }) => {
  var _a;
  const { state } = useSonority();
  return ((_a = state.currentTrack) == null ? void 0 : _a.image) ? /* @__PURE__ */ jsx(
    "img",
    {
      src: state.currentTrack.image.src,
      alt: state.currentTrack.image.alt,
      className
    }
  ) : null;
};
var TrackComponent = ({ className, children }) => {
  var _a;
  const { state } = useSonority();
  return /* @__PURE__ */ jsx("div", { className, children: children || ((_a = state.currentTrack) == null ? void 0 : _a.title) });
};
var ArtistComponent = ({ className, children }) => {
  var _a;
  const { state } = useSonority();
  return /* @__PURE__ */ jsx("div", { className, children: children || ((_a = state.currentTrack) == null ? void 0 : _a.artist) });
};
var Current = Object.assign(
  ({ is = "track", className, children }) => {
    var _a, _b, _c;
    const { state } = useSonority();
    switch (is) {
      case "cover":
        return /* @__PURE__ */ jsx(CoverComponent, { className });
      case "track":
        return /* @__PURE__ */ jsx(TrackComponent, { className, children });
      case "artist":
        return /* @__PURE__ */ jsx(ArtistComponent, { className, children });
      case "album":
        return /* @__PURE__ */ jsx("div", { className, children: children || ((_a = state.currentTrack) == null ? void 0 : _a.album) });
      case "writtenBy":
        return /* @__PURE__ */ jsx("div", { className, children: children || ((_b = state.currentTrack) == null ? void 0 : _b.writtenBy) });
      case "copyright":
        return /* @__PURE__ */ jsx("div", { className, children: children || ((_c = state.currentTrack) == null ? void 0 : _c.copyright) });
      default:
        return /* @__PURE__ */ jsx("div", { className, children });
    }
  },
  {
    Cover: CoverComponent,
    Track: TrackComponent,
    Artist: ArtistComponent
  }
);
var Control = ({ className, children, is }) => {
  const { state, dispatch, audioControls } = useSonority();
  const handlePlayPause = () => {
    if (!state.currentTrack && state.queue.length > 0) {
      dispatch({
        type: "SET_TRACK",
        payload: state.queue[0]
      });
    }
    dispatch({ type: state.isPlaying ? "PAUSE" : "PLAY" });
  };
  const getControlContent = () => {
    switch (is) {
      case "play":
      case "pause":
        return /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handlePlayPause,
            className,
            children
          }
        );
      case "next":
        return /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => dispatch({ type: "NEXT_TRACK" }),
            className,
            disabled: state.queue.length <= 1,
            children
          }
        );
      case "previous":
        return /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => dispatch({ type: "PREVIOUS_TRACK" }),
            className,
            disabled: state.queue.length <= 1,
            children
          }
        );
      case "seek":
        return /* @__PURE__ */ jsxs(
          Slider.Root,
          {
            style: {
              width: "100%",
              height: "3px",
              position: "relative",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              touchAction: "none",
              userSelect: "none",
              ...typeof className === "string" ? parseStyleString(className) : {}
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
                    height: "3px",
                    backgroundColor: "#d1d5db",
                    // gray-300
                    borderRadius: "9999px"
                  },
                  children: /* @__PURE__ */ jsx(
                    Slider.Range,
                    {
                      style: {
                        position: "absolute",
                        height: "100%",
                        backgroundColor: "#2563eb",
                        // blue-500
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
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#2563eb",
                    // blue-500
                    borderRadius: "50%",
                    border: "none",
                    outline: "none",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    transition: "background-color 0.2s"
                  },
                  "aria-label": "Seek"
                }
              )
            ]
          }
        );
      case "volume":
        return /* @__PURE__ */ jsxs(
          Slider.Root,
          {
            style: {
              width: "100%",
              height: "3px",
              position: "relative",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              touchAction: "none",
              userSelect: "none",
              ...typeof className === "string" ? parseStyleString(className) : {}
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
                    height: "3px",
                    backgroundColor: "#e5e7eb",
                    // gray-200
                    borderRadius: "9999px"
                  },
                  children: /* @__PURE__ */ jsx(
                    Slider.Range,
                    {
                      style: {
                        position: "absolute",
                        height: "100%",
                        backgroundColor: "#2563eb",
                        // blue-500
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
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#2563eb",
                    // blue-500
                    borderRadius: "50%",
                    border: "none",
                    outline: "none",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    transition: "background-color 0.2s"
                  },
                  "aria-label": "Volume"
                }
              )
            ]
          }
        );
      case "repeat":
        return /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => dispatch({ type: "TOGGLE_REPEAT" }),
            className,
            children
          }
        );
      default:
        return children;
    }
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-sonority-component": "control",
      "data-sonority-component-is": is,
      children: getControlContent()
    }
  );
};
function parseStyleString(className) {
  var _a, _b;
  const styles = {};
  const widthMap = {
    "w-full": "100%",
    "w-1/2": "50%",
    "w-1/4": "25%"
    // Add more as needed
  };
  const heightMap = {
    "h-full": "100%",
    "h-1": "0.25rem",
    "h-2": "0.5rem",
    "h-3": "0.75rem"
    // Add more as needed
  };
  const widthClass = (_a = className.match(/w-[^\s]+/)) == null ? void 0 : _a[0];
  if (widthClass)
    styles.width = widthMap[widthClass] || widthClass.replace("w-", "");
  const heightClass = (_b = className.match(/h-[^\s]+/)) == null ? void 0 : _b[0];
  if (heightClass)
    styles.height = heightMap[heightClass] || heightClass.replace("h-", "");
  return styles;
}
var Track2 = ({ className, title, artist, image, src, id, onClick, children, ...props }) => {
  var _a;
  const { dispatch, state } = useSonority();
  const isCurrentTrack = ((_a = state.currentTrack) == null ? void 0 : _a.id) === id;
  return /* @__PURE__ */ jsx(
    "button",
    {
      "data-sonority-component": "track",
      "data-sonority-current": isCurrentTrack,
      className,
      onClick,
      children: children || /* @__PURE__ */ jsxs(Fragment, { children: [
        image && /* @__PURE__ */ jsx(
          "img",
          {
            src: image.src,
            alt: image.alt || title,
            className: "w-full h-auto"
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { children: title }),
          artist && /* @__PURE__ */ jsx("p", { children: artist })
        ] })
      ] })
    }
  );
};
var Playlist = ({
  name,
  id,
  children,
  className
}) => {
  const { dispatch, state } = useSonority();
  useEffect(() => {
    const trackElements = React2.Children.toArray(children).filter(
      (child) => React2.isValidElement(child) && child.type === Track2
    );
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
      "data-sonority-component": "playlist",
      "data-sonority-playlist-id": id,
      "data-sonority-playlist-name": name,
      className,
      children: React2.Children.map(children, (child) => {
        if (React2.isValidElement(child) && child.type === Track2) {
          return React2.cloneElement(child, {
            ...child.props,
            onClick: () => handleTrackSelect(child.props)
          });
        }
        return child;
      })
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
      variant,
      className,
      children
    }
  ) }),
  {
    Current,
    Control,
    Playlist,
    Track: Track2
  }
);

export { Control, Current, Playlist, Sonority, Track2 as Track };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map
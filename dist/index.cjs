'use strict';

var React5 = require('react');
var jsxRuntime = require('react/jsx-runtime');
var Slider = require('@radix-ui/react-slider');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React5__default = /*#__PURE__*/_interopDefault(React5);
var Slider__namespace = /*#__PURE__*/_interopNamespace(Slider);

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
var SonorityContext = React5.createContext(null);
var sonorityReducer = (state, action) => {
  var _a;
  switch (action.type) {
    case "SET_TRACK": {
      return {
        ...state,
        currentTrack: action.payload,
        currentTime: 0
        // Don't change isPlaying state here
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
    default:
      return state;
  }
};
var SonorityProvider = ({ children, id = crypto.randomUUID() }) => {
  var _a;
  const [state, dispatch] = React5.useReducer(sonorityReducer, initialState);
  const audioRef = React5.useRef(null);
  const playerIdRef = React5.useRef(id);
  React5.useEffect(() => {
    audioManager.registerPlayer(playerIdRef.current, () => {
      dispatch({ type: "PAUSE" });
    });
    return () => {
      audioManager.unregisterPlayer(playerIdRef.current);
    };
  }, []);
  React5.useEffect(() => {
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
  React5.useEffect(() => {
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
  React5.useEffect(() => {
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
  React5.useEffect(() => {
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
  React5.useEffect(() => {
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
  return /* @__PURE__ */ jsxRuntime.jsxs(SonorityContext.Provider, { value, children: [
    children,
    state.currentTrack && /* @__PURE__ */ jsxRuntime.jsx(
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
  const context = React5.useContext(SonorityContext);
  if (!context) {
    throw new Error("useSonority must be used within a SonorityProvider");
  }
  return context;
};
var CurrentContext = React5.createContext(null);
var CurrentContextProvider = ({ children, className }) => {
  const { state } = useSonority();
  const contextValue = {
    currentTrack: state.currentTrack
  };
  return /* @__PURE__ */ jsxRuntime.jsx(CurrentContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className, children }) });
};
var Current = Object.assign(({ children, className }) => /* @__PURE__ */ jsxRuntime.jsx(CurrentContextProvider, { className, children: children || /* @__PURE__ */ jsxRuntime.jsx(Current.Track, {}) }), {
  Provider: CurrentContextProvider
});
var useCurrentContext = () => {
  const context = React5.useContext(CurrentContext);
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
      return /* @__PURE__ */ jsxRuntime.jsx("div", { className, children });
    if (defaultRenderer && currentTrack) {
      const renderedContent = defaultRenderer(currentTrack);
      return renderedContent ? /* @__PURE__ */ jsxRuntime.jsx("div", { className, children: renderedContent }) : null;
    }
    return currentTrack && currentTrack[propName] ? /* @__PURE__ */ jsxRuntime.jsx("div", { className, children: currentTrack[propName] }) : null;
  };
};
Current.Cover = createSubcomponent(
  "image",
  (track) => track.image ? /* @__PURE__ */ jsxRuntime.jsx(
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
Current.Track = createSubcomponent("title");
Current.Artist = createSubcomponent("artist");
Current.Album = createSubcomponent("album");
Current.WrittenBy = createSubcomponent("writtenBy");
Current.Copyright = createSubcomponent("copyright");
var ControlContext = React5.createContext(null);
var ControlContextProvider = ({ children, className }) => {
  const { state, dispatch, audioControls } = useSonority();
  const contextValue = {
    state,
    dispatch,
    audioControls
  };
  return /* @__PURE__ */ jsxRuntime.jsx(ControlContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-sonority-component": "control",
      className,
      children
    }
  ) });
};
var Control = Object.assign(({ children, className }) => /* @__PURE__ */ jsxRuntime.jsx(ControlContextProvider, { className, children }), {
  Provider: ControlContextProvider
});
var useControlContext = () => {
  const context = React5.useContext(ControlContext);
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
      onClick: handlePlayPause,
      className,
      children: children || (state.isPlaying ? "Pause" : "Play")
    }
  );
};
Control.Previous = ({ className, children }) => {
  const { state, dispatch } = useControlContext();
  return /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
      onClick: () => dispatch({ type: "PREVIOUS_TRACK" }),
      className,
      disabled: state.queue.length <= 1,
      children: children || "Previous"
    }
  );
};
Control.Next = ({ className, children }) => {
  const { state, dispatch } = useControlContext();
  return /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
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
  return /* @__PURE__ */ jsxRuntime.jsxs(
    Slider__namespace.Root,
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
        /* @__PURE__ */ jsxRuntime.jsx(
          Slider__namespace.Track,
          {
            style: {
              position: "relative",
              flexGrow: 1,
              height: "4px",
              backgroundColor: "currentColor",
              borderRadius: "9999px"
            },
            children: /* @__PURE__ */ jsxRuntime.jsx(
              Slider__namespace.Range,
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
        /* @__PURE__ */ jsxRuntime.jsx(
          Slider__namespace.Thumb,
          {
            style: {
              width: "16px",
              height: "16px",
              minHeight: "16px",
              minWidth: "16px",
              backgroundColor: "rgba(0,0,0,0.5)",
              border: "2px solid currentColor",
              outline: "none",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              transition: "background-color 0.2s"
            },
            "aria-label": "Seek"
          }
        )
      ]
    }
  );
};
Control.Volume = ({ className, children }) => {
  const { state, dispatch, audioControls } = useControlContext();
  return /* @__PURE__ */ jsxRuntime.jsxs(
    Slider__namespace.Root,
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
        /* @__PURE__ */ jsxRuntime.jsx(
          Slider__namespace.Track,
          {
            style: {
              position: "relative",
              flexGrow: 1,
              height: "4px",
              backgroundColor: "currentColor",
              borderRadius: "9999px"
            },
            children: /* @__PURE__ */ jsxRuntime.jsx(
              Slider__namespace.Range,
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
        /* @__PURE__ */ jsxRuntime.jsx(
          Slider__namespace.Thumb,
          {
            style: {
              width: "16px",
              height: "16px",
              minHeight: "16px",
              minWidth: "16px",
              backgroundColor: "currentColor",
              border: "2px solid white",
              outline: "none",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              transition: "background-color 0.2s"
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
      onClick: handleRepeat,
      className,
      children: children || "Repeat"
    }
  );
};
var TrackContext = React5.createContext(null);
var Track2 = ({ className, title, artist, writtenBy, album, image, src, id, onClick, children, coverWidth = 32, coverClassName = "", genre, year, duration, ...props }) => {
  var _a;
  const { dispatch, state } = useSonority();
  const isCurrentTrack = ((_a = state.currentTrack) == null ? void 0 : _a.id) === id;
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
        genre,
        year,
        duration,
        ...props
      }
    });
    onClick == null ? void 0 : onClick();
  };
  if (React5__default.default.Children.count(children) > 0) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      TrackContext.Provider,
      {
        value: {
          title,
          artist,
          writtenBy,
          album,
          image,
          src,
          id,
          genre,
          year,
          duration,
          ...props
        },
        children: /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            "data-sonority-component": "track",
            "data-sonority-current": isCurrentTrack,
            className,
            onClick: handleTrackClick,
            children
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    TrackContext.Provider,
    {
      value: {
        title,
        artist,
        writtenBy,
        album,
        image,
        src,
        id,
        genre,
        year,
        duration,
        ...props
      },
      children: /* @__PURE__ */ jsxRuntime.jsxs(
        "button",
        {
          "data-sonority-component": "track",
          "data-sonority-current": isCurrentTrack,
          className,
          onClick: handleTrackClick,
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(Track2.Cover, {}),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntime.jsx(Track2.Title, {}),
              /* @__PURE__ */ jsxRuntime.jsx(Track2.Artist, {}),
              writtenBy && /* @__PURE__ */ jsxRuntime.jsx(Track2.WrittenBy, {}),
              album && /* @__PURE__ */ jsxRuntime.jsx(Track2.Album, {})
            ] })
          ]
        }
      )
    }
  );
};
var useTrackContext = () => {
  const context = React5.useContext(TrackContext);
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
Track2.Title = ({ className, children }) => {
  const track = useTrackContext();
  if (children)
    return /* @__PURE__ */ jsxRuntime.jsx("p", { className, children });
  return /* @__PURE__ */ jsxRuntime.jsx(
    "p",
    {
      className,
      style: { textAlign: "start" },
      children: track.title
    }
  );
};
Track2.Artist = ({ className, children }) => {
  const track = useTrackContext();
  if (children)
    return /* @__PURE__ */ jsxRuntime.jsx("p", { className, children });
  return track.artist ? /* @__PURE__ */ jsxRuntime.jsx("p", { className, children: track.artist }) : null;
};
Track2.WrittenBy = ({ className, children }) => {
  const track = useTrackContext();
  if (children)
    return /* @__PURE__ */ jsxRuntime.jsx("p", { className, children });
  return track.writtenBy ? /* @__PURE__ */ jsxRuntime.jsxs("p", { className, children: [
    "Written by: ",
    track.writtenBy
  ] }) : null;
};
Track2.Album = ({ className, children }) => {
  const track = useTrackContext();
  if (children)
    return /* @__PURE__ */ jsxRuntime.jsx("p", { className, children });
  return track.album ? /* @__PURE__ */ jsxRuntime.jsxs("p", { className, children: [
    "Album: ",
    track.album
  ] }) : null;
};
Track2.Genre = ({ className, children }) => {
  const track = useTrackContext();
  if (children)
    return /* @__PURE__ */ jsxRuntime.jsx("p", { className, children });
  return track.genre ? /* @__PURE__ */ jsxRuntime.jsxs("p", { className, children: [
    "Genre: ",
    track.genre
  ] }) : null;
};
Track2.Year = ({ className, children }) => {
  const track = useTrackContext();
  if (children)
    return /* @__PURE__ */ jsxRuntime.jsx("p", { className, children });
  return track.year ? /* @__PURE__ */ jsxRuntime.jsxs("p", { className, children: [
    "Year: ",
    track.year
  ] }) : null;
};
Track2.Duration = ({ className, children }) => {
  const track = useTrackContext();
  if (children)
    return /* @__PURE__ */ jsxRuntime.jsx("p", { className, children });
  return track.duration ? /* @__PURE__ */ jsxRuntime.jsxs("p", { className, children: [
    "Duration: ",
    formatDuration(track.duration)
  ] }) : null;
};
Track2.Cover = ({ className, imgClassName, altClassName }) => {
  const track = useTrackContext();
  return track.image ? /* @__PURE__ */ jsxRuntime.jsxs("figure", { className, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      "img",
      {
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
    track.image.alt && /* @__PURE__ */ jsxRuntime.jsx("figcaption", { hidden: true, className: altClassName, children: track.image.alt })
  ] }) : null;
};
Track2.CustomProperty = ({ name, className, children }) => {
  const track = useTrackContext();
  const propertyValue = track[name];
  if (children)
    return /* @__PURE__ */ jsxRuntime.jsx("p", { className, children });
  return propertyValue ? /* @__PURE__ */ jsxRuntime.jsxs("p", { className, children: [
    name,
    ": ",
    propertyValue.toString()
  ] }) : null;
};
var Playlist = ({
  name,
  id,
  children,
  className
}) => {
  const { dispatch, state } = useSonority();
  React5.useEffect(() => {
    const trackElements = React5__default.default.Children.toArray(children).filter(
      (child) => React5__default.default.isValidElement(child) && child.type === Track2
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-sonority-component": "playlist",
      "data-sonority-playlist-id": id,
      "data-sonority-playlist-name": name,
      className,
      children: React5__default.default.Children.map(children, (child) => {
        if (React5__default.default.isValidElement(child) && child.type === Track2) {
          return React5__default.default.cloneElement(child, {
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
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  ({ variant, className, children }) => /* @__PURE__ */ jsxRuntime.jsx(SonorityProvider, { id: true, children: /* @__PURE__ */ jsxRuntime.jsx(
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

exports.Control = Control;
exports.Current = Current;
exports.Playlist = Playlist;
exports.Sonority = Sonority;
exports.Track = Track2;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map
// src/components/Control.tsx
import React, { createContext, useContext } from "react";
import { useSonority } from "../context/SonorityContext";
import * as Slider from "@radix-ui/react-slider";

export interface ControlContextType {
  state: any;
  dispatch: (action: { type: string; payload?: any }) => void;
  audioControls: any;
}

const ControlContext = createContext<ControlContextType | null>(null);

// Default context provider that allows subcomponents to be used independently
const ControlContextProvider: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
}> = ({ children, className }) => {
  const { state, dispatch, audioControls } = useSonority();

  const contextValue: ControlContextType = {
    state,
    dispatch,
    audioControls
  };

  return (
    <ControlContext.Provider value={contextValue}>
      <div 
        data-sonority-component="control"
        className={className}
      >
        {children}
      </div>
    </ControlContext.Provider>
  );
};

export const Control: React.FC<{ 
  children?: React.ReactNode; 
  className?: string; 
}> & {
  Play: React.FC<{ className?: string; children?: React.ReactNode }>;
  Pause: React.FC<{ className?: string; children?: React.ReactNode }>;
  Previous: React.FC<{ className?: string; children?: React.ReactNode }>;
  Next: React.FC<{ className?: string; children?: React.ReactNode }>;
  Seek: React.FC<{ className?: string; children?: React.ReactNode }>;
  Volume: React.FC<{ className?: string; children?: React.ReactNode }>;
  Shuffle: React.FC<{ className?: string; children?: React.ReactNode }>;
  Repeat: React.FC<{ className?: string; children?: React.ReactNode }>;
} = Object.assign(
  ({ children, className }) => (
    <ControlContextProvider className={className}>
      {children}
    </ControlContextProvider>
  ),
  {
    Provider: ControlContextProvider,
  }
);

// Utility hook to access control context
const useControlContext = () => {
  const context = useContext(ControlContext);
  if (!context) {
    // If no context is available, use the global Sonority state
    const { state, dispatch, audioControls } = useSonority();
    return { state, dispatch, audioControls };
  }
  return context;
};

// Subcomponent for Play/Pause
Control.Play = ({ className, children }) => {
  const { state, dispatch } = useControlContext();
  
  const handlePlayPause = () => {
    if (!state.currentTrack && state.queue.length > 0) {
      dispatch({
        type: "SET_TRACK",
        payload: state.queue[0],
      });
    }
    dispatch({ type: state.isPlaying ? "PAUSE" : "PLAY" });
  };
  
  return (
    <button
      onClick={handlePlayPause}
      className={className}>
      {children || (state.isPlaying ? 'Pause' : 'Play')}
    </button>
  );
};

// Subcomponent for Previous Track
Control.Previous = ({ className, children }) => {
  const { state, dispatch } = useControlContext();
  
  return (
    <button
      onClick={() => dispatch({ type: "PREVIOUS_TRACK" })}
      className={className}
      disabled={state.queue.length <= 1}>
      {children || 'Previous'}
    </button>
  );
};

// Subcomponent for Next Track
Control.Next = ({ className, children }) => {
  const { state, dispatch } = useControlContext();
  
  return (
    <button
      onClick={() => dispatch({ type: "NEXT_TRACK" })}
      className={className}
      disabled={state.queue.length <= 1}>
      {children || 'Next'}
    </button>
  );
};

// Subcomponent for Seek
Control.Seek = ({ className, children }) => {
  const { state, dispatch, audioControls } = useControlContext();
  
  return (
    <Slider.Root
      style={{
        width: "100%",
        height: "10px",
        position: "relative",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        touchAction: "none",
        userSelect: "none",
      }}
      value={[state.currentTime]}
      onValueChange={(value) => {
        if (audioControls?.seek && value.length > 0) {
          audioControls.seek(value[0]);
          dispatch({ type: "SET_TIME", payload: value[0] });
        }
      }}
      max={state.duration || 0}
      step={0.1}>
      <Slider.Track
        style={{
          position: "relative",
          flexGrow: 1,
          height: "4px",
          backgroundColor: "currentColor",
          borderRadius: "9999px",
        }}>
        <Slider.Range
          style={{
            position: "absolute",
            height: "100%",
            backgroundColor: "currentColor",
            borderRadius: "9999px",
            left: 0,
            right: 0,
          }}
        />
      </Slider.Track>
      <Slider.Thumb
        style={{
          width: "16px",
          height: "16px",
          backgroundColor: "currentColor",
          borderRadius: "50%",
          border: "2px solid white",
          outline: "none",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          transition: "background-color 0.2s",
        }}
        aria-label="Seek"
      />
    </Slider.Root>
  );
};

// Subcomponent for Volume
Control.Volume = ({ className, children }) => {
  const { state, dispatch, audioControls } = useControlContext();
  
  return (
    <Slider.Root
      style={{
        width: "100%",
        height: "10px",
        position: "relative",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        touchAction: "none",
        userSelect: "none",
      }}
      value={[state.volume]}
      max={1}
      step={0.01}
      onValueChange={(value) => {
        if (value.length > 0) {
          dispatch({ type: "SET_VOLUME", payload: value[0] });
          audioControls.setVolume(value[0]);
        }
      }}>
      <Slider.Track
        style={{
          position: "relative",
          flexGrow: 1,
          height: "4px",
          backgroundColor: "currentColor",
          borderRadius: "9999px",
        }}>
        <Slider.Range
          style={{
            position: "absolute",
            height: "100%",
            backgroundColor: "currentColor",
            borderRadius: "9999px",
            left: 0,
            right: 0,
          }}
        />
      </Slider.Track>
      <Slider.Thumb
        style={{
          width: "16px",
          height: "16px",
          backgroundColor: "currentColor",
          borderRadius: "50%",
          border: "2px solid white",
          outline: "none",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          transition: "background-color 0.2s",
        }}
        aria-label="Volume"
      />
    </Slider.Root>
  );
};

// Subcomponent for Shuffle
Control.Shuffle = ({ className, children }) => {
  const { state, dispatch } = useControlContext();
  
  return (
    <button
      onClick={() => dispatch({ type: "TOGGLE_SHUFFLE" })}
      className={className}>
      {children || 'Shuffle'}
    </button>
  );
};

// Subcomponent for Repeat
Control.Repeat = ({ className, children }) => {
  const { state, dispatch } = useControlContext();
  
  const handleRepeat = () => {
    // Cycle through repeat modes
    if (!state.isRepeating && !state.isRepeatingOne) {
      dispatch({ type: "TOGGLE_REPEAT" });
    } else if (state.isRepeating) {
      dispatch({ type: "TOGGLE_REPEAT" });
      dispatch({ type: "TOGGLE_REPEAT_ONE" });
    } else if (state.isRepeatingOne) {
      dispatch({ type: "TOGGLE_REPEAT_ONE" });
    }
  };
  
  return (
    <button
      onClick={handleRepeat}
      className={className}>
      {children || 'Repeat'}
    </button>
  );
};

export default Control;
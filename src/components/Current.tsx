// src/components/Current.tsx
import React, { createContext, useContext } from "react";
import { useSonority } from "../context/SonorityContext";
import type { TrackProps } from "../types";

export interface CurrentContextType {
  currentTrack: TrackProps | null;
}

const CurrentContext = createContext<CurrentContextType | null>(null);

// Default context provider that allows subcomponents to be used independently
const CurrentContextProvider: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const { state } = useSonority();

  const contextValue: CurrentContextType = {
    currentTrack: state.currentTrack,
  };

  return (
    <CurrentContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </CurrentContext.Provider>
  );
};

export const Current:
  | React.FC<{
      children?: React.ReactNode | any;
      className?: string | any;
    }>
  | (any & {
      Cover: React.FC<{ className?: string; children?: React.ReactNode }>;
      Track: React.FC<{ className?: string; children?: React.ReactNode }>;
      Artist: React.FC<{ className?: string; children?: React.ReactNode }>;
      Album: React.FC<{ className?: string; children?: React.ReactNode }>;
      WrittenBy: React.FC<{ className?: string; children?: React.ReactNode }>;
      Copyright: React.FC<{ className?: string; children?: React.ReactNode }>;
      Genre: React.FC<{ className?: string; children?: React.ReactNode }>;
      Year: React.FC<{ className?: string; children?: React.ReactNode }>;
    }) = Object.assign(({ children, className }: { children?: React.ReactNode; className?: string }) => <CurrentContextProvider className={className}>{children || <Current.Track />}</CurrentContextProvider>, {
  Provider: CurrentContextProvider,
});

// Utility hook to access current track context
const useCurrentContext = () => {
  const context = useContext(CurrentContext);
  if (!context) {
    // If no context is available, use the global Sonority state
    const { state } = useSonority();
    return { currentTrack: state.currentTrack };
  }
  return context;
};

// Subcomponent definitions
const createSubcomponent = (propName: keyof TrackProps, defaultRenderer?: (track: TrackProps) => React.ReactNode) => {
  return ({ className, children }: { className?: string; children?: React.ReactNode }) => {
    const { currentTrack } = useCurrentContext();

    // If children are explicitly provided, use them
    if (children) return <div className={className}>{children}</div>;

    // Use default renderer if provided
    if (defaultRenderer && currentTrack) {
      const renderedContent = defaultRenderer(currentTrack);
      return renderedContent ? <div className={className}>{renderedContent}</div> : null;
    }

    // Default rendering based on prop
    return currentTrack && currentTrack[propName] ? <div className={className}>{currentTrack[propName] as any}</div> : null;
  };
};

// Attach subcomponents
Current.Cover = createSubcomponent("image", (track) =>
  track.image ? (
    <img
      src={track.image.src}
      alt={track.image.alt || "Album Cover"}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  ) : null
);

Current.Track = createSubcomponent("title");
Current.Artist = createSubcomponent("artist");
Current.Album = createSubcomponent("album");
Current.WrittenBy = createSubcomponent("writtenBy");
Current.Copyright = createSubcomponent("copyright");
// Current.Genre = createSubcomponent('genre');
// Current.Year = createSubcomponent('year');

export default Current;

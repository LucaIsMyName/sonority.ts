import React, { createContext, useContext, memo } from "react";
import { useTrackInfo, usePlaybackControls } from "../context/SonorityContext";
import { VolumeGraph, VolumeGraphProps } from "./shared/VolumeGraph";

export interface TrackProps {
  className?: string;
  title: string;
  artist?: string;
  writtenBy?: string;
  album?: string;
  image?: { src: string; alt?: string };
  src: string;
  copyright: string;
  id: string;
  onClick?: () => void;
  children?: React.ReactNode;
  coverWidth?: number;
  coverClassName?: string;
  genre?: string;
  year?: number;
  duration?: number;
  [key: string]: any;
}

// Create a context to share track information
const TrackContext = createContext<TrackProps | null>(null);

export const Track = memo(
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
  }: TrackProps &
    (any & {
      Cover: React.FC<{ className?: string; children?: React.ReactNode }>;
      Track: React.FC<{ className?: string; children?: React.ReactNode }>;
      Artist: React.FC<{ className?: string; children?: React.ReactNode }>;
      Album: React.FC<{ className?: string; children?: React.ReactNode }>;
      WrittenBy: React.FC<{ className?: string; children?: React.ReactNode }>;
      Copyright: React.FC<{ className?: string; children?: React.ReactNode }>;
      Genre: React.FC<{ className?: string; children?: React.ReactNode }>;
      CurrentTime: React.FC<{ className?: string; children?: React.ReactNode }>;
      Duration: React.FC<{ className?: string; children?: React.ReactNode }>;
      Year: React.FC<{ className?: string; children?: React.ReactNode }>;
    })) => {
    const { currentTrack } = useTrackInfo();
    const { dispatch } = usePlaybackControls();
    const isCurrentTrack = currentTrack?.id === id;

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
          ...props,
        },
      });
      onClick?.();
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
      ...props,
    };

    return (
      <TrackContext.Provider value={contextValue}>
        <button
          data-sonority-component="Track"
          data-sonority-current={isCurrentTrack}
          className={className}
          onClick={handleTrackClick}>
          {children || (
            <>
              <Track.Cover />
              <div>
                <Track.Title />
                <Track.Artist />
                {writtenBy && <Track.WrittenBy />}
                {copyright && (
                  <p>
                    &copy; <Track.Copyright />
                  </p>
                )}
                {album && <Track.Album />}
              </div>
            </>
          )}
        </button>
      </TrackContext.Provider>
    );
  }
);

// Hook to access track context

const useTrackContext = () => {
  const context = useContext(TrackContext);
  if (!context) {
    throw new Error("Track components must be rendered inside a Track component");
  }
  return context;
};

// Helper function to format duration
const formatDuration = (duration?: number) => {
  if (!duration) return "";
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Title Subcomponent
Track.Title = memo(({ className, children }: { className?: string; children?: React.ReactNode }) => {
  const track = useTrackContext();

  return (
    <span
      data-sonority-component="Track.Title"
      className={className}
      style={{ textAlign: "start" }}>
      {children || track.title}
    </span>
  );
});

// Artist Subcomponent
Track.Artist = memo(({ className, children }: { className?: string; children?: React.ReactNode }) => {
  const track = useTrackContext();

  if (children) return <p className={className}>{children}</p>;
  return track.artist ? <p className={className}>{track.artist}</p> : null;
});

// WrittenBy Subcomponent
Track.WrittenBy = memo(({ className, children }: { className?: string; children?: React.ReactNode }) => {
  const track = useTrackContext();

  return (
    <span
      data-sonority-component="Track.WrittenBy"
      className={className}>
      {children || track.writtenBy}
    </span>
  );
});

Track.VolumeGraph = ({ className, ...props }: VolumeGraphProps) => {
  const track = useTrackContext();

  return (
    <div
      data-sonority-component="Track.VolumeGraph"
      className={className}>
      <VolumeGraph
        {...props}
        trackId={track.id}
      />
    </div>
  );
};

// Album Subcomponent
Track.Album = memo(({ className, children }: { className?: string; children?: React.ReactNode }) => {
  const track = useTrackContext();

  return track.album ? (
    <span
      data-sonority-component="Track.Album"
      className={className}>
      {children || track.album}
    </span>
  ) : null;
});

// Genre Subcomponent
Track.Genre = ({ className, children }: any) => {
  const track = useTrackContext();

  // If children are explicitly provided, use them
  if (children)
    return (
      <span
        data-sonority-component={`Track.Genre`}
        className={className}>
        {children}
      </span>
    );

  // Default genre rendering (only if genre exists)
  return track.genre ? (
    <span
      data-sonority-component={`Track.Genre`}
      className={className}>
      {track.genre}
    </span>
  ) : null;
};

// Year Subcomponent
Track.Year = ({ className, children }: any) => {
  const track = useTrackContext();

  // If children are explicitly provided, use them
  if (children)
    return (
      <span
        data-sonority-component={`Track.Year`}
        className={className}>
        {children}
      </span>
    );

  // Default year rendering (only if year exists)
  return track.year ? (
    <span
      data-sonority-component={`Track.Year`}
      className={className}>
      {track.year}
    </span>
  ) : null;
};

// Duration Subcomponent
Track.Duration = ({ className, children }: any) => {
  const track = useTrackContext();

  // If children are explicitly provided, use them
  if (children)
    return (
      <span
        data-sonority-component={`Track.Duration`}
        className={className}>
        {children}
      </span>
    );

  // Default duration rendering (only if duration exists)
  return track.duration ? (
    <span
      data-sonority-component={`Track.Duration`}
      className={className}>
      {formatDuration(track.duration)}
    </span>
  ) : null;
};

Track.CurrentTime = ({ className, children }: any) => {
  const track = useTrackContext();

  // If children are explicitly provided, use them
  if (children)
    return (
      <p
        data-sonority-component={`Track.CurrentTime`}
        className={className}>
        {children}
      </p>
    );

  // Default duration rendering (only if duration exists)
  return track.currentTime ? (
    <span
      data-sonority-component={`Track.CurrentTime`}
      className={className}>
      {formatDuration(track.currentTime)}
    </span>
  ) : null;
};

// Cover Subcomponent
Track.Cover = memo(({ className, imgClassName, altClassName }: { className?: string; imgClassName?: string; altClassName?: string }) => {
  const track = useTrackContext();

  return track.image ? (
    <figure className={className}>
      <img
        data-sonority-component="Track.Cover"
        src={track.image.src}
        alt={track.image.alt || track.title}
        className={imgClassName}
        style={{
          minWidth: "100%",
          minHeight: "100%",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      {track.image.alt && (
        <figcaption
          hidden
          className={altClassName}>
          {track.image.alt}
        </figcaption>
      )}
    </figure>
  ) : null;
});

// Custom Property Subcomponent
Track.CustomProperty = ({ name, className, children }: any) => {
  const track = useTrackContext();

  // Check if the custom property exists
  const propertyValue = track[name];

  // If children are explicitly provided, use them
  if (children)
    return (
      <p
        data-sonority-component={`Track.CustomProperty`}
        className={className}>
        {children}
      </p>
    );

  // Render custom property if it exists
  return propertyValue ? (
    <p
      className={className}
      data-sonority-component={`Track.CustomProperty`}>
      {name}: {propertyValue.toString()}
    </p>
  ) : null;
};

export default Track;

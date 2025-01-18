import React, { createContext, useContext } from "react";
import { useSonority } from "../context/SonorityContext";

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
  [key: string]: any; // Allow additional custom properties
}

// Create a context to share track information
const TrackContext = createContext<TrackProps | null>(null);

export const Track:
  | any
  | (React.FC<TrackProps> & {
      Title: React.FC<{ className?: string; children?: React.ReactNode }>;
      Artist: React.FC<{ className?: string; children?: React.ReactNode }>;
      WrittenBy: React.FC<{ className?: string; children?: React.ReactNode }>;
      Album: React.FC<{ className?: string; children?: React.ReactNode }>;
      Cover: React.FC<{
        className?: string;
        imgClassName?: string;
        altClassName?: string;
      }>;
      Genre: React.FC<{ className?: string; children?: React.ReactNode }>;
      Year: React.FC<{ className?: string; children?: React.ReactNode }>;
      Duration: React.FC<{ className?: string; children?: React.ReactNode }>;
      Copyright: React.FC<{
        className?: string;
        children?: React.ReactNode;
        [key: string]: any;
      }>;
      CustomProperty: React.FC<{
        name: string;
        className?: string;
        children?: React.ReactNode;
      }>;
      [key: string]: any;
    }) = ({ className, title, artist, writtenBy, album, image, src, id, onClick, children, coverWidth = 32, coverClassName = "", genre, year, duration, copyright, ...props }: any) => {
  const { dispatch, state } = useSonority();
  const isCurrentTrack = state.currentTrack?.id === id;

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

  // If children are explicitly provided, use them
  if (React.Children.count(children) > 0) {
    return (
      <TrackContext.Provider
        value={{
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
        }}>
        <button
          data-sonority-component="Track"
          data-sonority-current={isCurrentTrack}
          className={className}
          onClick={handleTrackClick}>
          {children}
        </button>
      </TrackContext.Provider>
    );
  }

  // Default rendering if no children
  return (
    <TrackContext.Provider
      value={{
        title,
        artist,
        copyright,
        writtenBy,
        album,
        image,
        src,
        id,
        genre,
        year,
        duration,
        ...props,
      }}>
      <button
        data-sonority-component="Track"
        data-sonority-current={isCurrentTrack}
        className={className}
        onClick={handleTrackClick}>
        <Track.Cover />
        <div>
          <Track.Title />
          <Track.Artist />
          {writtenBy && (
            <p>
              <Track.WrittenBy />
            </p>
          )}
          {copyright && (
            <p>
              &copy; <Track.Copyright />
            </p>
          )}
          {album && (
            <p>
              <Track.Album />
            </p>
          )}
        </div>
      </button>
    </TrackContext.Provider>
  );
};

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
Track.Title = ({ className, children }:any) => {
  const track = useTrackContext();

  // If children are explicitly provided, use them
  if (children)
    return (
      <span
        data-sonority-component={`Track.Title`}
        className={className}>
        {children}
      </span>
    );

  // Default title rendering
  return (
    <span
      data-sonority-component={`Track.Title`}
      className={className}
      style={{ textAlign: "start" }}>
      {track.title}
    </span>
  );
};

// Artist Subcomponent
Track.Artist = ({ className, children }:any) => {
  const track = useTrackContext();

  // If children are explicitly provided, use them
  if (children) return <p className={className}>{children}</p>;

  // Default artist rendering (only if artist exists)
  return track.artist ? <p className={className}>{track.artist}</p> : null;
};

// WrittenBy Subcomponent
Track.WrittenBy = ({ className, children }:any) => {
  const track = useTrackContext();

  // If children are explicitly provided, use them
  if (children)
    return (
      <span
        data-sonority-component={`Track.WrittenBy`}
        className={className}>
        {children}
      </span>
    );

  // Default writtenBy rendering (only if writtenBy exists)
  return track.writtenBy ? (
    <span
      data-sonority-component={`Track.WrittenBy`}
      className={className}>
      {track.writtenBy}
    </span>
  ) : null;
};

// Album Subcomponent
Track.Album = ({ className, children }:any) => {
  const track = useTrackContext();

  // If children are explicitly provided, use them
  if (children)
    return (
      <span
        data-sonority-component={`Track.Album`}
        className={className}>
        {children}
      </span>
    );

  // Default album rendering (only if album exists)
  return track.album ? (
    <span
      data-sonority-component={`Track.Album`}
      className={className}>
      {track.album}
    </span>
  ) : null;
};

// Genre Subcomponent
Track.Genre = ({ className, children }:any) => {
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
Track.Year = ({ className, children }:any) => {
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
Track.Duration = ({ className, children }:any) => {
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
Track.Cover = ({ className, imgClassName, altClassName }:any) => {
  const track = useTrackContext();

  // Only render if image exists
  return track.image ? (
    <figure className={className}>
      <img
        data-sonority-component={`Track.Cover`}
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
};

// Custom Property Subcomponent
Track.CustomProperty = ({ name, className, children }:any) => {
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

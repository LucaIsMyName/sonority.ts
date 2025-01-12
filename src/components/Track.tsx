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

export const Track: React.FC<TrackProps> & {
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
  CustomProperty: React.FC<{
    name: string;
    className?: string;
    children?: React.ReactNode;
  }>;
} = ({ className, title, artist, writtenBy, album, image, src, id, onClick, children, coverWidth = 32, coverClassName = "", genre, year, duration, ...props }) => {
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
          src,
          id,
          genre,
          year,
          duration,
          ...props,
        }}>
        <button
          data-sonority-component="track"
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
        data-sonority-component="track"
        data-sonority-current={isCurrentTrack}
        className={className}
        onClick={handleTrackClick}>
        <Track.Cover />
        <div>
          <Track.Title />
          <Track.Artist />
          {writtenBy && <Track.WrittenBy />}
          {album && <Track.Album />}
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
Track.Title = ({ className, children }) => {
  const track = useTrackContext();

  // If children are explicitly provided, use them
  if (children) return <p className={className}>{children}</p>;

  // Default title rendering
  return (
    <p
      className={className}
      style={{ textAlign: "start" }}>
      {track.title}
    </p>
  );
};

// Artist Subcomponent
Track.Artist = ({ className, children }) => {
  const track = useTrackContext();

  // If children are explicitly provided, use them
  if (children) return <p className={className}>{children}</p>;

  // Default artist rendering (only if artist exists)
  return track.artist ? <p className={className}>{track.artist}</p> : null;
};

// WrittenBy Subcomponent
Track.WrittenBy = ({ className, children }) => {
  const track = useTrackContext();

  // If children are explicitly provided, use them
  if (children) return <p className={className}>{children}</p>;

  // Default writtenBy rendering (only if writtenBy exists)
  return track.writtenBy ? <p className={className}>Written by: {track.writtenBy}</p> : null;
};

// Album Subcomponent
Track.Album = ({ className, children }) => {
  const track = useTrackContext();

  // If children are explicitly provided, use them
  if (children) return <p className={className}>{children}</p>;

  // Default album rendering (only if album exists)
  return track.album ? <p className={className}>Album: {track.album}</p> : null;
};

// Genre Subcomponent
Track.Genre = ({ className, children }) => {
  const track = useTrackContext();

  // If children are explicitly provided, use them
  if (children) return <p className={className}>{children}</p>;

  // Default genre rendering (only if genre exists)
  return track.genre ? <p className={className}>Genre: {track.genre}</p> : null;
};

// Year Subcomponent
Track.Year = ({ className, children }) => {
  const track = useTrackContext();

  // If children are explicitly provided, use them
  if (children) return <p className={className}>{children}</p>;

  // Default year rendering (only if year exists)
  return track.year ? <p className={className}>Year: {track.year}</p> : null;
};

// Duration Subcomponent
Track.Duration = ({ className, children }) => {
  const track = useTrackContext();

  // If children are explicitly provided, use them
  if (children) return <p className={className}>{children}</p>;

  // Default duration rendering (only if duration exists)
  return track.duration ? <p className={className}>Duration: {formatDuration(track.duration)}</p> : null;
};

// Cover Subcomponent
Track.Cover = ({ className, imgClassName, altClassName }) => {
  const track = useTrackContext();

  // Only render if image exists
  return track.image ? (
    <figure className={className}>
      <img
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
      {track.image.alt && <figcaption hidden className={altClassName}>{track.image.alt}</figcaption>}
    </figure>
  ) : null;
};

// Custom Property Subcomponent
Track.CustomProperty = ({ name, className, children }) => {
  const track = useTrackContext();

  // Check if the custom property exists
  const propertyValue = track[name];

  // If children are explicitly provided, use them
  if (children) return <p className={className}>{children}</p>;

  // Render custom property if it exists
  return propertyValue ? (
    <p className={className}>
      {name}: {propertyValue.toString()}
    </p>
  ) : null;
};

export default Track;

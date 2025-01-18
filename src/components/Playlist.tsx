import React, { useEffect } from "react";
import { useSonority } from "../context/SonorityContext";
import { Track, TrackProps } from "./Track";

export interface PlaylistProps {
  name: string;
  id: string;
  className?: string;
  children: React.ReactNode;
}

// src/components/Playlist.tsx
export const Playlist: React.FC<PlaylistProps> = ({ name, id, children, className }) => {
  const { dispatch, state } = useSonority();

  // Single initialization effect
  useEffect(() => {
    const trackElements = React.Children.toArray(children).filter((child) => React.isValidElement(child) && child.type === Track);

    const extractedTracks = trackElements.map((track: any) => ({
      ...track.props,
      id: track.props.id || crypto.randomUUID(),
    }));

    // Initialize playlist
    dispatch({
      type: "SET_PLAYLIST",
      payload: {
        id,
        name,
        tracks: extractedTracks,
      },
    });

    // Select first track by default if no track is currently selected
    if (!state.currentTrack && extractedTracks.length > 0) {
      dispatch({
        type: "SET_TRACK",
        payload: extractedTracks[0],
      });
    }
  }, [id, name]);

  const handleTrackSelect = (trackProps: TrackProps) => {
    dispatch({
      type: "SET_TRACK",
      payload: trackProps,
    });
  };

  return (
    <div
      data-sonority-component="Playlist"
      data-sonority-playlist-id={id}
      data-sonority-playlist-name={name}
      className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === Track) {
          return React.cloneElement(child, {
            ...child.props,
            onClick: () => handleTrackSelect(child.props),
          });
        }
        return child;
      })}
    </div>
  );
};

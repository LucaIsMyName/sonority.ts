import React from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

interface TrackProps {
    className?: string;
    title: string;
    artist?: string;
    image?: {
        src: string;
        alt?: string;
    };
    src: string;
    id: string;
    onClick?: () => void;
}
interface TrackComponentProps extends TrackProps {
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
}
declare const Track: React.FC<TrackComponentProps>;

interface PlaylistProps {
    name: string;
    id: string;
    className?: string;
    children: React.ReactNode;
}
declare const Playlist: React.FC<PlaylistProps>;

interface ControlProps {
    is: "play" | "pause" | "stop" | "next" | "previous" | "shuffle" | "repeat" | "volume" | "seek";
    className?: string;
    children?: React.ReactNode;
}
declare const Control: React.FC<ControlProps>;

interface CurrentProps {
    className?: string;
    children?: React.ReactNode;
    is?: "cover" | "track" | "playlist" | "artist" | "album" | "copyright" | "writtenBy";
}
declare const CoverComponent: React.FC<{
    className?: string;
}>;
declare const TrackComponent: React.FC<{
    className?: string;
    children?: React.ReactNode;
}>;
declare const ArtistComponent: React.FC<{
    className?: string;
    children?: React.ReactNode;
}>;
declare const Current: React.FC<CurrentProps> & {
    Cover: typeof CoverComponent;
    Track: typeof TrackComponent;
    Artist: typeof ArtistComponent;
};

interface SonorityProps {
    variant?: "single" | "playlist" | "multiPlaylist";
    className?: string;
    children: React.ReactNode;
}
declare const Sonority: (({ variant, className, children }: SonorityProps) => react_jsx_runtime.JSX.Element) & {
    Current: React.FC<CurrentProps> & {
        Cover: React.FC<{
            className?: string;
        }>;
        Track: React.FC<{
            className?: string;
            children?: React.ReactNode;
        }>;
        Artist: React.FC<{
            className?: string;
            children?: React.ReactNode;
        }>;
    };
    Control: React.FC<ControlProps>;
    Playlist: React.FC<PlaylistProps>;
    Track: React.FC<TrackComponentProps>;
};

export { Control, Current, Playlist, Sonority, Track };

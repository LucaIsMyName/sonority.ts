import React from 'react';

interface SonorityProps {
    variant?: "single" | "playlist" | "multiPlaylist";
    className?: string;
    children: React.ReactNode | any;
    [key: string]: any;
}
declare const Sonority: SonorityProps | any;

interface TrackProps$1 {
    className?: string;
    title: string;
    artist?: string;
    writtenBy?: string;
    album?: string;
    image?: {
        src: string;
        alt?: string;
    };
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
declare const Track: any | (React.FC<TrackProps$1> & {
    Title: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Artist: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    WrittenBy: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Album: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Cover: React.FC<{
        className?: string;
        imgClassName?: string;
        altClassName?: string;
    }>;
    Genre: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Year: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Duration: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
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
});

interface PlaylistProps$1 {
    name: string;
    id: string;
    className?: string;
    children: React.ReactNode;
}
declare const Playlist: React.FC<PlaylistProps$1>;

interface SpeedControlOptions {
    min?: number;
    max?: number;
    default?: number;
    steps?: number;
    variant?: "range" | "select" | "buttons";
}
declare const Control: any | (React.FC<{
    children?: React.ReactNode;
    className?: string;
}> & {
    Play: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Pause: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Previous: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Next: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Seek: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Volume: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Shuffle: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Repeat: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Mute: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Speed: React.FC<{
        className?: string;
        children?: React.ReactNode;
        options?: SpeedControlOptions;
    }>;
});

interface ImageProps {
    src: string;
    alt?: string;
}
interface TrackProps {
    id: string;
    src: string;
    title?: string;
    description?: string;
    dateAdded?: Date;
    artist?: string;
    copyright?: string;
    writtenBy?: string;
    isDownloadActive?: boolean;
    image?: ImageProps;
    album?: string;
    [key: string]: any;
}
interface PlaylistProps {
    id: string;
    name?: string;
    order?: 'asc' | 'desc' | 'dateAdded' | 'artist' | 'copyright' | 'writtenBy';
    isDownloadActive?: boolean;
    isShuffleActive?: boolean;
    image?: ImageProps;
    tracks?: TrackProps[];
}

declare const Current: React.FC<{
    children?: React.ReactNode | any;
    className?: string | any;
}> | (any & {
    Cover: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Track: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Artist: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Album: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    WrittenBy: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Copyright: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Genre: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    CurrentTime: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Duration: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
    Year: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
});

interface SonorityState {
    currentTrack: TrackProps | null;
    currentPlaylist: PlaylistProps | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    previousVolume: number;
    isMuted: boolean;
    playbackRate: number;
    isShuffled: boolean;
    isRepeating: boolean;
    isRepeatingOne: boolean;
    queue: TrackProps[];
}
interface AudioControls {
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
    setPlaybackRate: (rate: number) => void;
}
interface SonorityContextType {
    state: SonorityState;
    dispatch: React.Dispatch<SonorityAction>;
    audioControls: AudioControls;
}
type SonorityAction = {
    type: "SET_TRACK";
    payload: TrackProps;
} | {
    type: "SET_PLAYLIST";
    payload: PlaylistProps;
} | {
    type: "PLAY";
} | {
    type: "PAUSE";
} | {
    type: "SET_VOLUME";
    payload: number;
} | {
    type: "SET_TIME";
    payload: number;
} | {
    type: "SET_DURATION";
    payload: number;
} | {
    type: "TOGGLE_SHUFFLE";
} | {
    type: "TOGGLE_REPEAT";
} | {
    type: "TOGGLE_REPEAT_ONE";
} | {
    type: "NEXT_TRACK";
} | {
    type: "PREVIOUS_TRACK";
} | {
    type: "SET_QUEUE";
    payload: TrackProps[];
} | {
    type: "TOGGLE_MUTE";
} | {
    type: "SET_MUTED";
    payload: boolean;
} | {
    type: "SET_PLAYBACK_RATE";
    payload: number;
};
declare const useSonority: () => SonorityContextType;

export { Control, Current, Playlist, Sonority, Track, Sonority as default, useSonority };

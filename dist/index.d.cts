import React from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

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
    order?: "asc" | "desc" | "dateAdded" | "artist" | "copyright" | "writtenBy";
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

interface VisualizerProps {
    className?: string;
    variant?: "waves" | "lines" | "bars" | "circle" | "equalizer" | "none" | undefined;
    width?: number;
    height?: number;
    color?: string;
}
/**
 *
 * @param variant - The type of visualizer to render. Can be "waves", "lines", "bars", "circle", "equalizer", or "none".
 * @param className - Additional CSS classes to apply to the canvas element.
 * @param width - The width of the visualizer canvas.
 * @param height - The height of the visualizer canvas.
 * @param color - The color of the visualizer bars, lines, or waves.
 * @returns A visualizer component that renders audio frequency data in a canvas element.
 * @example
 * ```tsx
 * <Visualizer variant="bars" width={300} height={150} color="#4ade80" />
 * ```
 *
 */
declare const Visualizer: ({ variant, className, width, height, color }: VisualizerProps) => react_jsx_runtime.JSX.Element;

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

declare const createPlaylist: (tracks: TrackProps[], name?: string) => PlaylistProps;
declare const mergePlaylists: (playlists: PlaylistProps[]) => PlaylistProps;
declare const filterPlaylist: (playlist: PlaylistProps, predicate: (track: TrackProps) => boolean) => PlaylistProps;
declare const sortPlaylist: (playlist: PlaylistProps, order: "asc" | "desc" | "dateAdded" | "artist" | "copyright" | "writtenBy") => PlaylistProps;
declare const shufflePlaylist: (playlist: PlaylistProps) => PlaylistProps;
declare const toggleMute: (audio: HTMLAudioElement) => void;
declare const toggleLoop: (audio: HTMLAudioElement) => void;
declare const togglePlaybackRate: (audio: HTMLAudioElement) => void;
declare const toggleControls: (audio: HTMLAudioElement) => void;
declare const toggleAutoplay: (audio: HTMLAudioElement) => void;
declare const stringUtils: {
    toKebab: (str: string) => string;
    toPascal: (str: string) => string;
    toCamel: (str: string) => string;
    toSnake: (str: string) => string;
    toTitle: (str: string) => string;
    toSentence: (str: string) => string;
    toCapital: (str: string) => string;
    toLower: (str: string) => string;
    toUpper: (str: string) => string;
    toTrim: (str: string) => string;
    toReverse: (str: string) => string;
    toReplace: (str: string, search: string, replace: string) => string;
    toSlice: (str: string, start: number, end: number) => string;
    toSubstring: (str: string, start: number, end: number) => string;
    toCharAt: (str: string, index: number) => string;
    toCharCodeAt: (str: string, index: number) => number;
    toCodePointAt: (str: string, index: number) => number | undefined;
    toConcat: (str: string, ...args: string[]) => string;
    toIncludes: (str: string, search: string) => boolean;
    toEndsWith: (str: string, search: string) => boolean;
    toStartsWith: (str: string, search: string) => boolean;
    toIndexOf: (str: string, search: string) => number;
    toLastIndexOf: (str: string, search: string) => number;
    toMatch: (str: string, search: string) => RegExpMatchArray | null;
    toSearch: (str: string, search: string) => number;
};
declare const audioUtils: {
    play: (audio: HTMLAudioElement) => Promise<void>;
    pause: (audio: HTMLAudioElement) => void;
    seek: (audio: HTMLAudioElement, time: number) => void;
};

export { Control, Current, Playlist, Sonority, Track, Visualizer, audioUtils, createPlaylist, Sonority as default, filterPlaylist, mergePlaylists, shufflePlaylist, sortPlaylist, stringUtils, toggleAutoplay, toggleControls, toggleLoop, toggleMute, togglePlaybackRate, useSonority };

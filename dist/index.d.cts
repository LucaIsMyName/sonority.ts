import React from 'react';

declare const Sonority: any;

interface TrackProps {
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
declare const Track: React.FC<TrackProps> & {
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
    CustomProperty: React.FC<{
        name: string;
        className?: string;
        children?: React.ReactNode;
    }>;
};

interface PlaylistProps {
    name: string;
    id: string;
    className?: string;
    children: React.ReactNode;
}
declare const Playlist: React.FC<PlaylistProps>;

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
});

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
    Year: React.FC<{
        className?: string;
        children?: React.ReactNode;
    }>;
});

export { Control, Current, Playlist, Sonority, Track };

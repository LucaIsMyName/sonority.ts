export type SonorityVariant = 'single' | 'playlist' | 'multiPlaylist';

export interface ImageProps {
  src: string;
  alt?: string;
}

export interface TrackProps {
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
  album?: string;  // Add this line
  [key: string]: any;  // Allow additional properties

}

export interface PlaylistProps {
  id: string;
  name?: string;
  order?: 'asc' | 'desc' | 'dateAdded' | 'artist' | 'copyright' | 'writtenBy';
  isDownloadActive?: boolean;
  isShuffleActive?: boolean;
  image?: ImageProps;
  tracks?: TrackProps[];
}

import { TrackProps, PlaylistProps } from './types';

export const createPlaylist = (tracks: TrackProps[], name?: string): PlaylistProps => ({
  id: crypto.randomUUID(),
  name,
  tracks,
});

export const mergePlaylists = (playlists: PlaylistProps[]): PlaylistProps => ({
  id: crypto.randomUUID(),
  name: 'Merged Playlist',
  tracks: playlists.flatMap(playlist => playlist.tracks || []),
});

export const filterPlaylist = (
  playlist: PlaylistProps,
  predicate: (track: TrackProps) => boolean
): PlaylistProps => ({
  ...playlist,
  tracks: playlist.tracks?.filter(predicate) || [],
});
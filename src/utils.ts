import { TrackProps, PlaylistProps } from "./types";

export const createPlaylist = (tracks: TrackProps[], name?: string): PlaylistProps => ({
  id: crypto.randomUUID(),
  name,
  tracks,
});

export const mergePlaylists = (playlists: PlaylistProps[]): PlaylistProps => ({
  id: crypto.randomUUID(),
  name: "Merged Playlist",
  tracks: playlists.flatMap((playlist) => playlist.tracks || []),
});

export const filterPlaylist = (playlist: PlaylistProps, predicate: (track: TrackProps) => boolean): PlaylistProps => ({
  ...playlist,
  tracks: playlist.tracks?.filter(predicate) || [],
});

export const sortPlaylist = (playlist: PlaylistProps, order: "asc" | "desc" | "dateAdded" | "artist" | "copyright" | "writtenBy"): PlaylistProps => ({
  ...playlist,
  tracks:
    playlist.tracks?.sort((a, b) => {
      if (order === "asc") {
        return a[order] > b[order] ? 1 : -1;
      }
      if (order === "desc") {
        return a[order] < b[order] ? 1 : -1;
      }
      return 0;
    }) || [],
});

export const shufflePlaylist = (playlist: PlaylistProps): PlaylistProps => ({
  ...playlist,
  tracks: playlist.tracks?.sort(() => Math.random() - 0.5) || [],
});

export const toggleMute = (audio: HTMLAudioElement) => {
  audio.muted = !audio.muted;
};

export const toggleLoop = (audio: HTMLAudioElement) => {
  audio.loop = !audio.loop;
};

export const togglePlaybackRate = (audio: HTMLAudioElement) => {
  audio.playbackRate = audio.playbackRate === 1 ? 2 : 1;
};

export const toggleControls = (audio: HTMLAudioElement) => {
  audio.controls = !audio.controls;
};

export const toggleAutoplay = (audio: HTMLAudioElement) => {
  audio.autoplay = !audio.autoplay;
};

export const togglePreload = (audio: HTMLAudioElement) => {
  audio.preload = audio.preload === "none" ? "auto" : "none";
};

export const toggleCrossOrigin = (audio: HTMLAudioElement) => {
  audio.crossOrigin = audio.crossOrigin === "anonymous" ? "use-credentials" : "anonymous";
};

export const audioState = (audio: HTMLAudioElement) => {
  return {
    currentTime: audio.currentTime,
    duration: audio.duration,
    ended: audio.ended,
    error: audio.error,
    loop: audio.loop,
    muted: audio.muted,
    paused: audio.paused,
    playbackRate: audio.playbackRate,
    readyState: audio.readyState,
    seeking: audio.seeking,
    volume: audio.volume,
  };
};

export const stringUtils = {
  toKebab: (str: string) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase(),
  toPascal: (str: string) => str.replace(/(\w)(\w*)/g, (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase()),
  toCamel: (str: string) => str.replace(/(\w)(\w*)/g, (_, g1, g2) => g1.toLowerCase() + g2.toLowerCase()),
  toSnake: (str: string) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1_$2").toLowerCase(),
  toTitle: (str: string) => str.replace(/(\w)(\w*)/g, (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase()),
  toSentence: (str: string) => str.replace(/(\w)(\w*)/g, (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase()),
  toCapital: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
  toLower: (str: string) => str.toLowerCase(),
  toUpper: (str: string) => str.toUpperCase(),
  toTrim: (str: string) => str.trim(),
  toReverse: (str: string) => str.split("").reverse().join(""),
  toReplace: (str: string, search: string, replace: string) => str.replace(new RegExp(search, "g"), replace),
  toSlice: (str: string, start: number, end: number) => str.slice(start, end),
  toSubstring: (str: string, start: number, end: number) => str.substring(start, end),
  toCharAt: (str: string, index: number) => str.charAt(index),
  toCharCodeAt: (str: string, index: number) => str.charCodeAt(index),
  toCodePointAt: (str: string, index: number) => str.codePointAt(index),
  toConcat: (str: string, ...args: string[]) => str.concat(...args),
  toIncludes: (str: string, search: string) => str.includes(search),
  toEndsWith: (str: string, search: string) => str.endsWith(search),
  toStartsWith: (str: string, search: string) => str.startsWith(search),
  toIndexOf: (str: string, search: string) => str.indexOf(search),
  toLastIndexOf: (str: string, search: string) => str.lastIndexOf(search),
  toMatch: (str: string, search: string) => str.match(new RegExp(search, "g")),
  toSearch: (str: string, search: string) => str.search(new RegExp(search, "g")),
};

export const audioUtils = {
  play: (audio: HTMLAudioElement) => audio.play(),
  pause: (audio: HTMLAudioElement) => audio.pause(),
  seek: (audio: HTMLAudioElement, time: number) => {
    audio.currentTime = time;
  }
};


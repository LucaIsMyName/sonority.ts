import React from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, List, Disc, Expand } from "lucide-react";
import { Sonority } from "../components/Sonority";
import { useSonority } from "../context/SonorityContext";

function getRandomImageUrl() {
  // i have 4 images in /public/img named img-1.jgp, img-2.jpg, ... , get a random one of these
  const randomIndex = Math.floor(Math.random() * 4) + 1;
  return `./img/img-${randomIndex}.jpg`;
}

// Comprehensive track list
const comprehensivePlaylist = [
  {
    id: "1",
    title: "Morning Coffee",
    artist: "Cafe Kaleidoscope",
    src: "./audio/song-1.mp3",
    image: {
      src: getRandomImageUrl(),
      alt: "Morning Coffee",
    },
    album: "Daily Rhythms",
    genre: "Acoustic",
    year: 2023,
  },
  {
    id: "2",
    title: "Afternoon Tea",
    artist: "Cafe Kaleidoscope",
    src: "./audio/song-2.mp3",
    image: {
      src: getRandomImageUrl(),
      alt: "Afternoon Tea",
    },
    album: "Daily Rhythms",
    genre: "Acoustic",
    year: 2023,
  },
  {
    id: "3",
    title: "Evening Jazz",
    artist: "Cafe Kaleidoscope",
    src: "./audio/song-3.mp3",
    image: {
      src: getRandomImageUrl(),
      alt: "Evening Jazz",
    },
    album: "Nightfall Sessions",
    genre: "Jazz",
    year: 2022,
  },
  {
    id: "4",
    title: "Deep House Groove",
    artist: "Urban Rhythm",
    src: "./audio/song-4.mp3",
    image: {
      src: getRandomImageUrl(),
      alt: "Deep House Groove",
    },
    album: "Urban Pulse",
    genre: "Electronic",
    year: 2023,
  },
  {
    id: "5",
    title: "Techno Nights",
    artist: "Neon Pulse",
    src: "./audio/song-5.mp3",
    image: {
      src: getRandomImageUrl(),
      alt: "Techno Nights",
    },
    album: "Neon Dreams",
    genre: "Electronic",
    year: 2022,
  },
  {
    id: "6",
    title: "Electronic Dreams",
    artist: "Synth Wave",
    src: "./audio/song-6.mp3",
    image: {
      src: getRandomImageUrl(),
      alt: "Electronic Dreams",
    },
    album: "Future Sounds",
    genre: "Synthwave",
    year: 2023,
  },
];

// Spotify/Apple Music-like Interface
const SpotifyStylePlayer = () => {
  const { state } = useSonority();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-neutral-900 rounded-lg border-gray-900 border-2 text-white h-screen flex flex-col">
      <div className="flex flex-grow">
        {/* Playlist (Full Width) */}
        <div className="w-full p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Your Playlist</h2>
          <Sonority.Playlist
            id="spotify-playlist"
            name="Daily Mix"
            className="space-y-2">
            {comprehensivePlaylist.map((track) => (
              <Sonority.Track
                key={track.id}
                {...track}
                className="flex text-left border border-gray-800 shadow-sm pr-4 w-full items-center p-2 hover:bg-neutral-800 rounded-lg group">
                <div className="flex items-center w-full">
                  <Sonority.Track.Cover
                    className="w-12 h-12 mr-4 rounded-md"
                    imgClassName="object-cover"
                  />
                  <div className="flex-grow">
                    <Sonority.Track.Title className="font-semibold group-hover:text-green-500" />
                    <Sonority.Track.Artist className="text-xs text-neutral-400" />
                  </div>
                  <div className="text-neutral-400 text-sm">
                    <Sonority.Track.Album />
                  </div>
                </div>
              </Sonority.Track>
            ))}
          </Sonority.Playlist>
        </div>

        {/* Now Playing Section */}
        <div className="w-full max-w-96 bg-neutral-800 p-6 py-12 flex flex-col items-center justify-start">
          <Sonority.Current.Cover className="w-64 h-64 aspect-square rounded-lg shadow-2xl mb-6" />
          <div className="text-center mb-6">
            <Sonority.Current.Track className="text-xl font-bold" />
            <Sonority.Current.Artist className="text-neutral-400" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-neutral-800 p-4 shadow-lg">
        <div className=" mx-auto">
          <div className="flex items-center justify-center space-x-6 mb-4">
            <Sonority.Control.Previous>
              <SkipBack className="w-6 h-6" />
            </Sonority.Control.Previous>
            <Sonority.Control.Play className="bg-white text-black p-3 rounded-full hover:bg-neutral-200">{state.isPlaying ? <Pause /> : <Play />}</Sonority.Control.Play>
            <Sonority.Control.Next>
              <SkipForward className="w-6 h-6" />
            </Sonority.Control.Next>
          </div>
          <div className="flex flex-col gap-4 items-center space-x-4">
            <section className="flex items-center flex-1 w-full gap-4">
              <div className=" text-neutral-400 text-sm flex">{formatTime(state.currentTime)}</div>
              <div className="flex-grow flex-1 w-full flex-1 min-w-96">
                <Sonority.Control.Seek className=" text-neutral-500 " />
              </div>
              <div className="text-neutral-400 text-sm">{formatTime(state.duration)}</div>
            </section>
            <div className="flex w-full flex-1 max-w-32">
              <Sonority.Control.Volume className="text-neutral-500 size-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper for SpotifyStylePlayer
const SpotifyStylePlayerWrapper = () => (
  <Sonority
    variant="playlist"
    className="col-span-3">
    <SpotifyStylePlayer />
  </Sonority>
);

// Single Track Minimalist Player
const SingleTrackPlayer = () => {
  const { state } = useSonority();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-md mx-auto">
      <div className="flex flex-col items-center">
        <Sonority.Current.Cover className="w-64 h-64 rounded-lg mb-6 shadow-xl" />

        <div className="text-center mb-6">
          <Sonority.Current.Track className="text-2xl font-bold text-gray-800" />
          <Sonority.Current.Artist className="text-gray-600 text-lg" />
        </div>

        <div className="w-full space-y-4">
          <Sonority.Control.Seek className="w-full text-blue-500" />

          <div className="flex justify-between text-gray-500 text-sm">
            <span>{formatTime(state.currentTime)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>

          <div className="flex items-center justify-between">
            <Sonority.Control.Previous className="text-gray-600 hover:text-blue-600">
              <SkipBack />
            </Sonority.Control.Previous>

            <Sonority.Control.Play className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600">{state.isPlaying ? <Pause /> : <Play />}</Sonority.Control.Play>

            <Sonority.Control.Next className="text-gray-600 hover:text-blue-600">
              <SkipForward />
            </Sonority.Control.Next>
          </div>

          <div className="flex items-center space-x-4">
            <Volume2 className="text-gray-500" />
            <Sonority.Control.Volume className="flex-grow text-blue-500" />
          </div>
        </div>
      </div>

      {/* Single Track in Background */}
      <Sonority.Playlist
        id="single-track"
        name="Current Track"
        className="hidden">
        <Sonority.Track {...comprehensivePlaylist[0]} />
      </Sonority.Playlist>
    </div>
  );
};

// Wrapper for SingleTrackPlayer
const SingleTrackPlayerWrapper = () => (
  <Sonority variant="single">
    <SingleTrackPlayer />
  </Sonority>
);

// Simple Playlist Player
const SimplePlaylistPlayer = () => {
  const { state } = useSonority();

  return (
    <div className="bg-gray-100 rounded-xl max-w-md mx-auto">
      <div className="">
        <Sonority.Playlist
          id="simple-playlist"
          name="Music Collection"
          className="">
          {comprehensivePlaylist.map((track) => (
            <Sonority.Track
              key={track.id}
              {...track}
              className="flex w-full text-left items-center bg-white transition">
              <div className="flex items-center w-full p-2">
                <Sonority.Track.Cover
                  className="w-16 h-16 mr-4"
                  imgClassName="object-cover"
                />
                <div className="flex-grow">
                  <Sonority.Track.Title className="font-medium text-gray-800" />
                  <Sonority.Track.Artist className="text-sm text-gray-500" />
                </div>
              </div>
            </Sonority.Track>
          ))}
        </Sonority.Playlist>
      </div>

      {/* Bottom Controls */}
      <div className="bg-gray-100">
        <div className="flex items-center justify-between mb-4 mr-4">
          <div className="p-2">
            <Sonority.Current.Cover className="w-16 overflow-hidden aspect-square rounded bg-gray-100" />
          </div>
          <div className="flex-grow ml-2">
            <Sonority.Current.Track className="font-semibold text-gray-800" />
            <Sonority.Current.Artist className="text-sm text-gray-500" />
          </div>
          <div className="flex space-x-2">
            <Sonority.Control.Previous>
              <SkipBack className="w-5 h-5 text-gray-600" />
            </Sonority.Control.Previous>
            <Sonority.Control.Play className="bg-blue-500 text-white p-2 rounded-full">{state.isPlaying ? <Pause /> : <Play />}</Sonority.Control.Play>
            <Sonority.Control.Next>
              <SkipForward className="w-5 h-5 text-gray-600" />
            </Sonority.Control.Next>
          </div>
        </div>
        <div className="p-4">
          <Sonority.Control.Seek className="w-full " />
        </div>
      </div>
    </div>
  );
};

// Wrapper for SimplePlaylistPlayer
const SimplePlaylistPlayerWrapper = () => (
  <Sonority variant="playlist">
    <SimplePlaylistPlayer />
  </Sonority>
);

// Audio Player Examples Container
const AudioPlayerExamples = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Sonority Audio Player Examples</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <SingleTrackPlayerWrapper />
        <SimplePlaylistPlayerWrapper />
        <SpotifyStylePlayerWrapper />
      </div>
    </div>
  );
};

export default AudioPlayerExamples;

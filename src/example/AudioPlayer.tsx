import React from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Repeat1, Disc } from "lucide-react";
import { Sonority } from "../components/Sonority";
import { useSonority } from "../context/SonorityContext";

// Enhanced playlist with more detailed track information
const enhancedPlaylist = [
  {
    id: "1",
    title: "Cosmic Echoes",
    artist: "Stellar Waves",
    src: "./audio/song-1.mp3",
    image: {
      src: "https://wolkenmacher.at/wp-content/uploads/2023/03/fx-5.jpg",
      alt: "Cosmic Echoes Album Cover",
    },
    writtenBy: "Alex Stardust",
    album: "Interstellar Frequencies",
    genre: "Electronic Ambient",
    year: 2022,
    duration: 245,
    mood: "Contemplative",
    bpm: 85,
  },
  {
    id: "2",
    title: "Urban Rhythms",
    artist: "City Pulse",
    src: "./audio/song-2.mp3",
    image: {
      src: "https://wolkenmacher.at/wp-content/uploads/2023/03/fx-5.jpg",
      alt: "Urban Rhythms Album Cover",
    },
    writtenBy: "Maya Soundscape",
    album: "Metropolitan Beats",
    genre: "Electronic Jazz",
    year: 2023,
    duration: 202,
    mood: "Energetic",
    bpm: 120,
  },
  {
    id: "3",
    title: "Quantum Harmony",
    artist: "Nexus Collective",
    src: "./audio/song-3.mp3",
    image: {
      src: "https://wolkenmacher.at/wp-content/uploads/2023/03/fx-5.jpg",
      alt: "Quantum Harmony Album Cover",
    },
    writtenBy: "Dr. Sound Theory",
    album: "Sonic Dimensions",
    genre: "Experimental Electronic",
    year: 2021,
    duration: 315,
    mood: "Introspective",
    bpm: 95,
  },
];

const EnhancedPlaylistPlayer = () => {
  const { state } = useSonority();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl max-w-md mx-auto shadow-2xl overflow-hidden">
      <div className="p-6 bg-indigo-950/30">
        <h2 className="text-2xl font-bold text-center text-indigo-100 mb-6">Enhanced Music Library</h2>

        {/* Current Track Preview */}
        <div className="mb-6">
          <Sonority.Current.Cover className="w-48 h-48 mx-auto rounded-xl shadow-lg border-4 border-indigo-700" />
          <div className="text-center mt-4 text-indigo-100">
            <Sonority.Current.Track className="text-xl font-semibold" />
            <Sonority.Current.Artist className="text-sm text-indigo-300" />
          </div>
        </div>

        {/* Playback Controls */}
        <div className="space-y-4">
          <Sonority.Control.Seek className="w-full" />
          <div className="flex justify-between text-xs text-indigo-300">
            <span>{formatTime(state.currentTime)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>

          <div className="flex items-center justify-center space-x-6">
            <Sonority.Control.Previous className="p-3 bg-indigo-800 rounded-full hover:bg-indigo-700">
              <Play className="w-5 h-5 text-indigo-100 rotate-180" />
            </Sonority.Control.Previous>
            <Sonority.Control.Play className="p-4 bg-indigo-600 rounded-full hover:bg-indigo-500">{state.isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}</Sonority.Control.Play>
            <Sonority.Control.Next className="p-3 bg-indigo-800 rounded-full hover:bg-indigo-700">
              <Play className="w-5 h-5 text-indigo-100" />
            </Sonority.Control.Next>
          </div>

          <div className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5 text-indigo-400" />
            <Sonority.Control.Volume className="w-full" />
          </div>
        </div>
      </div>

      {/* Enhanced Playlist */}
      <div className="max-h-96 overflow-y-auto bg-indigo-950/20">
        <Sonority.Playlist
          name="Enhanced Music Collection"
          id="enhanced-playlist"
          className="divide-y divide-indigo-800/30">
          {enhancedPlaylist.map((track) => (
            <Sonority.Track
              key={track.id}
              {...track}
              className="p-4 hover:bg-indigo-900/20 transition-colors">
              <div className="grid grid-cols-3 gap-4 items-center">
                {/* Cover and Basic Info */}
                <div className="col-span-1 flex items-center space-x-4">
                  <Sonority.Track.Cover
                    className="w-16 h-16"
                    imgClassName="rounded-md"
                  />
                </div>

                {/* Detailed Track Info */}
                <div className="col-span-2 space-y-1">
                  <Sonority.Track.Title className="text-lg font-semibold text-indigo-100" />
                  <Sonority.Track.Artist className="text-sm text-indigo-300" />

                  <div className="text-xs text-indigo-400 space-y-0.5">
                    <Sonority.Track.Album />
                    <Sonority.Track.WrittenBy />
                    <Sonority.Track.Genre />
                    <Sonority.Track.Year />
                    <Sonority.Track.Duration />

                    {/* Custom Properties */}
                    <Sonority.Track.CustomProperty
                      name="mood"
                      className="italic"
                    />
                    <Sonority.Track.CustomProperty name="bpm" />
                  </div>
                </div>
              </div>
            </Sonority.Track>
          ))}
        </Sonority.Playlist>
      </div>
    </div>
  );
};

// Wrapper component with Sonority Provider
const EnhancedPlaylistPlayerWrapper = () => (
  <Sonority
    variant="playlist"
    className="divide-y divide-indigo-800/20">
    <EnhancedPlaylistPlayer />
  </Sonority>
);

const djPlaylistTracks = [
  {
    id: "1",
    title: "Deep House Groove",
    artist: "Urban Rhythm",
    src: "./audio/song-4.mp3",
    image: {
      src: "https://wolkenmacher.at/wp-content/uploads/2023/05/dj-mixer-1.jpg",
      alt: "Deep House Groove",
    },
  },
  {
    id: "2",
    title: "Techno Nights",
    artist: "Neon Pulse",
    src: "./audio/song-5.mp3",
    image: {
      src: "https://wolkenmacher.at/wp-content/uploads/2023/05/dj-mixer-2.jpg",
      alt: "Techno Nights",
    },
  },
  {
    id: "3",
    title: "Electronic Dreams",
    artist: "Synth Wave",
    src: "./audio/song-6.mp3",
    image: {
      src: "https://wolkenmacher.at/wp-content/uploads/2023/05/dj-mixer-3.jpg",
      alt: "Electronic Dreams",
    },
  },
];

// Example tracks
const singleTrack = {
  id: "1",
  title: "Midnight Jazz",
  artist: "Cafe Kaleidoscope",
  src: "./audio/song-1.mp3",
  image: {
    src: "https://wolkenmacher.at/wp-content/uploads/2023/03/fx-5.jpg",
    alt: "Midnight Jazz",
  },
};

const playlistTracks = [
  {
    id: "1",
    title: "Morning Coffee",
    artist: "Cafe Kaleidoscope",
    src: "./audio/song-1.mp3",
    image: { src: "https://wolkenmacher.at/wp-content/uploads/2023/04/IMG-20230419-WA0045.jpg", alt: "Morning Coffee" },
  },
  {
    id: "2",
    title: "Afternoon Tea",
    artist: "Cafe Kaleidoscope",
    src: "./audio/song-2.mp3",
    image: { src: "https://wolkenmacher.at/wp-content/uploads/2023/04/IMG-20230419-WA0046.jpg", alt: "Afternoon Tea" },
  },
  {
    id: "3",
    title: "Evening Jazz",
    artist: "Cafe Kaleidoscope",
    src: "./audio/song-3.mp3",
    image: { src: "https://wolkenmacher.at/wp-content/uploads/2023/04/Screenshot_20230419_181757_Gmail.jpg", alt: "Evening Jazz" },
  },
];

const DJPlayerContent = () => {
  const { state, dispatch } = useSonority();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const toggleRepeatMode = () => {
    if (!state.isRepeating && !state.isRepeatingOne) {
      // No repeat -> Repeat All
      dispatch({ type: "TOGGLE_REPEAT" });
    } else if (state.isRepeating && !state.isRepeatingOne) {
      // Repeat All -> Repeat One
      dispatch({ type: "TOGGLE_REPEAT_ONE" });
    } else {
      // Repeat One -> No repeat
      dispatch({ type: "TOGGLE_REPEAT_ONE" });
      dispatch({ type: "TOGGLE_REPEAT" });
    }
  };

  return (
    <>
      {/* Now Playing Section */}
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-6 rounded-t-xl">
        <div className="relative">
          {/* Spinning Vinyl Effect */}
          <div className={`absolute -inset-4 flex items-center justify-center ${state.isPlaying ? "animate-spin" : ""}`}>
            <Disc className="w-full h-full text-purple-300 opacity-20" />
          </div>

          {/* Album Cover */}
          <Sonority.Current.Cover className="relative z-10 w-48 h-48 mx-auto rounded-full border-8 border-purple-700 shadow-2xl" />
        </div>

        {/* Track Info */}
        <div className="text-center text-purple-100 mt-4">
          <Sonority.Current.Track className="text-xl font-bold" />
          <Sonority.Current.Artist className="text-sm opacity-75" />
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-purple-950/50 p-6 space-y-4">
        {/* Seek Bar */}
        <div className="space-y-2">
          <Sonority.Control.Seek
            className="w-full"
          />
          <div className="flex justify-between text-xs text-purple-300">
            <span>{formatTime(state.currentTime)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex justify-between items-center">
          {/* Shuffle Control */}
          <Sonority.Control.Shuffle
            className={`p-2 rounded-full ${state.isShuffled ? "bg-purple-600 text-purple-100" : "bg-purple-900 text-purple-400 hover:bg-purple-800"}`}>
            <Shuffle className="w-5 h-5" />
          </Sonority.Control.Shuffle>

          {/* Previous Track */}
          <Sonority.Control.Previous
            className="p-3 bg-purple-800 rounded-full hover:bg-purple-700">
            <SkipBack className="w-5 h-5 text-purple-100" />
          </Sonority.Control.Previous>

          {/* Play/Pause */}
          <Sonority.Control.Play
            className="p-4 bg-purple-600 rounded-full hover:bg-purple-500">
            {state.isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
          </Sonority.Control.Play>

          {/* Next Track */}
          <Sonority.Control.Next
            className="p-3 bg-purple-800 rounded-full hover:bg-purple-700">
            <SkipForward className="w-5 h-5 text-purple-100" />
          </Sonority.Control.Next>

          {/* Repeat Control */}
          <Sonority.Control.Repeat
            onClick={toggleRepeatMode}
            className={`p-2 rounded-full ${state.isRepeatingOne ? "bg-purple-600 text-purple-100" : state.isRepeating ? "bg-purple-600 text-purple-100" : "bg-purple-900 text-purple-400 hover:bg-purple-800"}`}>
            {state.isRepeatingOne ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
          </Sonority.Control.Repeat>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5 text-purple-400" />
          <Sonority.Control.Volume
            className="w-full"
          />
        </div>
      </div>

      {/* Playlist */}
      <div className="bg-purple-950/30 max-h-60 overflow-y-auto rounded-b-xl">
        <Sonority.Playlist
          name="DJ Playlist"
          id="dj"
          className="divide-y divide-purple-800/50">
          {djPlaylistTracks.map((track) => (
            <Sonority.Track
              key={track.id}
              {...track}
              className="flex justify-between w-full items-center p-4 hover:bg-purple-900/30 text-purple-100">
              <div className="flex items-center space-x-4">
                <img
                  src={track.image.src}
                  alt={track.title}
                  className="w-12 h-12 rounded-md"
                />
                <div>
                  <h3 className="font-medium">{track.title}</h3>
                  <p className="text-sm opacity-75">{track.artist}</p>
                </div>
              </div>
              {state.currentTrack?.id === track.id && <div className="w-2 h-2 bg-purple-500 rounded-full" />}
            </Sonority.Track>
          ))}
        </Sonority.Playlist>
      </div>
    </>
  );
};

const DJPlayer = () => (
  <div className="bg-gradient-to-br from-purple-950 to-indigo-900 rounded-xl max-w-md shadow-2xl overflow-hidden">
    <Sonority
      variant="playlist"
      className="divide-y divide-purple-800/20">
      <DJPlayerContent />
    </Sonority>
  </div>
);
// MinimalistPlayerContent needs to initialize the track
const MinimalistPlayerContent = () => {
  const { state } = useSonority();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Track Info */}
      <div className="flex items-center space-x-4">
        <Sonority.Control.Play
          className="p-3 rounded-full bg-white text-black hover:bg-gray-200 transition-colors">
          {state.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Sonority.Control.Play>
        <div>
          <Sonority.Current.Track className="font-medium" />
          <Sonority.Current.Artist className="text-sm text-gray-400" />
        </div>
      </div>

      {/* Seek Bar */}
      <div className="space-y-1">
        <Sonority.Control.Seek
          className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-white"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(state.currentTime)}</span>
          <span>{formatTime(state.duration)}</span>
        </div>
      </div>

      {/* Initialize the track in a playlist */}
      <Sonority.Playlist
        id="single"
        name="Single Track">
        <Sonority.Track
          className="hidden w-full items-center p-2 space-x-2 bg-gray-800 rounded text-white"
          coverClassName="w-11 h-11 rounded-full overflow-hidden"
          {...singleTrack}
        />
      </Sonority.Playlist>
    </>
  );
};

// Example 2: Retro Player Content
const RetroPlayerContent = () => {
  const { state } = useSonority();

  return (
    <>
      {/* Vinyl Animation */}
      <div className="relative">
        <div className={`absolute inset-0 flex items-center justify-center ${state.isPlaying ? "animate-spin" : ""}`}>
          <Disc className="w-24 h-24 text-amber-200 opacity-20" />
        </div>
        <Sonority.Current.Cover className="w-48 h-48 mx-auto rounded-full border-8 border-amber-700 shadow-xl" />
      </div>

      {/* Track Info */}
      <div className="text-center text-amber-100">
        <Sonority.Current.Track className="text-xl font-serif" />
        <Sonority.Current.Artist className="text-sm opacity-75" />
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center space-x-4">
        <Sonority.Control.Previous
          className="p-3 bg-amber-700 rounded-full hover:bg-amber-600">
          <SkipBack className="w-4 h-4 text-amber-100" />
        </Sonority.Control.Previous>
        <Sonority.Control.Play
          className="p-4 bg-amber-600 rounded-full hover:bg-amber-500">
          {state.isPlaying ? <Pause className="w-6 h-6 text-amber-100" /> : <Play className="w-6 h-6 text-amber-100" />}
        </Sonority.Control.Play>
        <Sonority.Control.Next
          className="p-3 bg-amber-700 rounded-full hover:bg-amber-600">
          <SkipForward className="w-4 h-4 text-amber-100" />
        </Sonority.Control.Next>
      </div>

      {/* Playlist */}
      <Sonority.Playlist
        name="Playlist"
        id="retro"
        className="space-y-2 mt-6">
        {playlistTracks.map((track) => (
          <Sonority.Track
            key={track.id}
            {...track}
            className="flex w-full items-center p-3 bg-amber-950/30 rounded hover:bg-amber-950/50 text-amber-100">
            <div className="text-left">
              <Sonority.Track.Title className="font-medium" />
              <Sonority.Track.Artist className="text-sm opacity-75" />
            </div>
          </Sonority.Track>
        ))}
      </Sonority.Playlist>
    </>
  );
};

// Example 3: Modern Player Content
const ModernPlayerContent = () => {
  const { state } = useSonority();

  return (
    <>
      {/* Now Playing */}
      <div className="p-6 space-y-6">
        <div className="flex items-start space-x-4">
          <Sonority.Current.Cover
            className="w-32 h-32 rounded-lg object-cover shadow-md"
          />
          <div>
            <Sonority.Current.Track className="text-xl font-semibold" />
            <Sonority.Current.Artist className="text-sm text-gray-500" />

            {/* Controls */}
            <div className="flex items-center space-x-4 mt-4">
              <Sonority.Control.Previous>
                <SkipBack className="w-5 h-5 text-gray-600 hover:text-gray-900" />
              </Sonority.Control.Previous>
              <Sonority.Control.Play
                className="p-3 bg-indigo-600 rounded-full hover:bg-indigo-700">
                {state.isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
              </Sonority.Control.Play>
              <Sonority.Control.Next >
                <SkipForward className="w-5 h-5 text-gray-600 hover:text-gray-900" />
              </Sonority.Control.Next>
            </div>
          </div>
        </div>

        {/* Progress & Volume */}
        <div className="space-y-4">
          <Sonority.Control.Seek
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-gray-500" />
            <Sonority.Control.Volume
              className="w-24 accent-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Playlist */}
      <div className="max-h-80 overflow-y-auto">
        <Sonority.Playlist
          name="Playlist"
          id="modern"
          className="divide-y divide-gray-100">
          {playlistTracks.map((track) => (
            <Sonority.Track
              key={track.id}
              {...track}
              className="flex relative justify-between w-full items-center p-4 hover:bg-indigo-50/50">
              <div className="flex relative z-10 text-left">
                <img
                  src={track.image.src}
                  alt={track.title}
                  className="w-12 h-12 rounded"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{track.title}</h3>
                  <p className="text-sm text-gray-500">{track.artist}</p>
                </div>
              </div>
              {state.currentTrack?.id === track.id && <div className="absolute inset-0 bg-indigo-50/50 hover:bg-indigo-50 z-0" />}
            </Sonority.Track>
          ))}
        </Sonority.Playlist>
      </div>
    </>
  );
};

// Wrapper components with Sonority providers
const MinimalistPlayer = () => (
  <div className="bg-black text-white p-4 rounded-xl max-w-sm">
    <Sonority
      variant="single"
      className="space-y-4">
      <MinimalistPlayerContent />
    </Sonority>
  </div>
);

const RetroPlayer = () => (
  <div className="bg-gradient-to-br from-amber-900 to-amber-800 p-8 rounded-lg max-w-md shadow-2xl">
    <Sonority
      variant="playlist"
      className="space-y-6">
      <RetroPlayerContent />
    </Sonority>
  </div>
);

const ModernPlayer = () => (
  <div className="bg-white rounded-xl max-w-lg shadow-lg">
    <Sonority
      variant="playlist"
      className="divide-y divide-gray-100">
      <ModernPlayerContent />
    </Sonority>
  </div>
);

// Container for all examples
const AudioPlayerExamples = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <MinimalistPlayer />
        <RetroPlayer />
        <ModernPlayer />
        <DJPlayer />
        <EnhancedPlaylistPlayerWrapper />
      </div>
    </div>
  );
};

export default AudioPlayerExamples;

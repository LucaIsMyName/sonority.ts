import { Sonority, useSonority } from "../../index";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

const PLAYLIST = [
  {
    id: "1",
    title: "Episode 1: Introduction to Podcasting",
    artist: "John Doe",
    src: "./audio/song-1.mp3",
    image: {
      src: "./vite.svg",
      alt: "Album 1",
    },
    duration: "45:30",
    description: "In this episode, we explore the basics of podcasting and what makes a great show.",
  },
  {
    id: "2",
    title: "Episode 2: Finding Your Voice",
    artist: "Jane Doe",
    src: "./audio/song-1.mp3",
    duration: "38:15",
    description: "Learn how to develop your unique podcasting voice and style.",
    image: {
      src: "./vite.svg",
      alt: "Album 1",
    },
  },
  {
    id: "3",
    title: "Episode 3: Technical Setup",
    artist: "John Doe",
    src: "./audio/song-1.mp3",
    duration: "42:00",
    description: "A complete guide to setting up your home recording studio.",
    image: {
      src: "./vite.svg",
      alt: "Album 1",
    },
  },
];

const PodcastContent = () => {
  const { state } = useSonority();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className=" mx-auto">
        {/* Current Episode Display */}
        <div className="relative z-10 bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Sonority.Current.Cover className="w-48 h-48 rounded-xl shadow-md" />
            <div className="flex-grow text-center md:text-left">
              <Sonority.Current.Track className="text-2xl font-bold text-gray-800 mb-2" />
              <Sonority.Current.Artist className="text-lg text-gray-600 mb-4" />

              {/* Progress Bar */}
              <div className="space-y-2 mb-4">
                <Sonority.Control.Seek className="w-full" />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{formatTime(state.currentTime)}</span>
                  <span>{formatTime(state.duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center md:justify-start space-x-4">
                <Sonority.Control.Previous className="p-2 hover:bg-gray-100 rounded-full transition">
                  <SkipBack className="w-6 h-6 text-gray-700" />
                </Sonority.Control.Previous>

                <Sonority.Control.Play className="p-4 bg-blue-600 rounded-full hover:bg-blue-700 transition">{state.isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}</Sonority.Control.Play>

                <Sonority.Control.Next className="p-2 hover:bg-gray-100 rounded-full transition">
                  <SkipForward className="w-6 h-6 text-gray-700" />
                </Sonority.Control.Next>

                <div className="flex items-center space-x-2">
                  <Sonority.Control.Mute className="p-2 hover:bg-gray-100 rounded-full transition">{state.isMuted ? <VolumeX className="w-6 h-6 text-gray-700" /> : <Volume2 className="w-6 h-6 text-gray-700" />}</Sonority.Control.Mute>
                  <Sonority.Control.Volume className="w-24 md:w-32 min-w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Episode List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 pt-12 -mt-12 mx-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Episodes</h2>
          <Sonority.Playlist
            name="Podcast"
            className="space-y-4">
            {PLAYLIST.map((track) => (
              <Sonority.Track
                key={track.id}
                {...track}
                className={`p-4 rounded-xl border transition cursor-pointer w-full text-left ${state.currentTrack?.id === track.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"}`}>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* <Sonority.Track.Cover className="w-24 h-24 rounded-lg shadow-sm" /> */}
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <Sonority.Track.Title className="font-semibold text-gray-800" />
                        <Sonority.Track.Artist className="text-sm text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-500">{track.duration}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{track.description}</p>
                  </div>
                </div>
              </Sonority.Track>
            ))}
          </Sonority.Playlist>
        </div>
      </div>
    </div>
  );
};

export const Podcast = () => {
  return (
    <Sonority variant="playlist">
      <PodcastContent />
    </Sonority>
  );
};

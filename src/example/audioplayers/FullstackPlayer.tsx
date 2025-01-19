import { Sonority, useSonority } from "../../index";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, ListMusic, Radio, Clock, Music, Search, MoreHorizontal, MessageCircle, ChevronLeft } from "lucide-react";
import { useState, useMemo } from "react";

// Playlists Data
const PLAYLIST_1 = [
  {
    id: "1",
    title: "Midnight Jazz",
    artist: "Jazz Trio",
    src: "./audio/song-1.mp3",
    duration: "5:30",
    image: {
      src: "./cover-3.jpg",
      alt: "Album 1",
    },
  },
  {
    id: "2",
    title: "Urban Beats",
    artist: "City Sound",
    src: "./audio/song-2.mp3",
    duration: "4:15",
    image: {
      src: "./cover-2.jpg",
      alt: "Album 1",
    },
  },
  {
    id: "3",
    title: "Acoustic Dreams",
    artist: "Guitar Masters",
    src: "./audio/song-3.mp3",
    duration: "3:45",
    image: {
      src: "./cover-1.jpg",
      alt: "Album 1",
    },
  },
];

const PLAYLIST_2 = [
  {
    id: "4",
    title: "Electronic Waves",
    artist: "Digital Artist",
    src: "./audio/song-4.mp3",
    duration: "6:20",
    image: {
      src: "./cover-2.jpg",
      alt: "Album 1",
    },
  },
  {
    id: "5",
    title: "Chill Vibes",
    artist: "Lofi Beats",
    src: "./audio/song-5.mp3",
    duration: "4:50",
    image: {
      src: "./cover-2.jpg",
      alt: "Album 1",
    },
  },
];

const PLAYLIST_3 = [
  {
    id: "6",
    title: "Classical Morning",
    artist: "Symphony Orchestra",
    src: "./audio/song-6.mp3",
    duration: "8:10",
    image: {
      src: "./cover-3.jpg",
      alt: "Album 1",
    },
  },
  {
    id: "7",
    title: "Piano Sonata",
    artist: "Piano Master",
    src: "./audio/song-5.mp3",
    duration: "5:45",
    image: {
      src: "./cover-4.jpg",
      alt: "Album 1",
    },
  },
];

const FullstackContent = () => {
  type PlaylistId = "1" | "2" | "3";
  const { state, dispatch } = useSonority();
  const [currentPlaylist, setCurrentPlaylist] = useState(PLAYLIST_1);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<PlaylistId>("1");
  const [playlistSearch, setPlaylistSearch] = useState("");
  const [playlistTrackSearches, setPlaylistTrackSearches] = useState<Record<PlaylistId, string>>({
    "1": "",
    "2": "",
    "3": "",
  });
  const filteredPlaylists = useMemo(() => {
    const allPlaylists = [
      { id: "1", name: "Playlist 1", tracks: PLAYLIST_1 },
      { id: "2", name: "Playlist 2", tracks: PLAYLIST_2 },
      { id: "3", name: "Playlist 3", tracks: PLAYLIST_3 },
    ];

    if (!playlistSearch) return allPlaylists;

    return allPlaylists.filter((playlist) => playlist.name.toLowerCase().includes(playlistSearch.toLowerCase()));
  }, [playlistSearch]);

  const filteredTracks = useMemo(() => {
    const currentSearch = playlistTrackSearches[selectedPlaylistId];
    if (!currentSearch) return currentPlaylist;

    return currentPlaylist.filter((track) => track.title.toLowerCase().includes(currentSearch.toLowerCase()) || track.artist.toLowerCase().includes(currentSearch.toLowerCase()));
  }, [currentPlaylist, selectedPlaylistId, playlistTrackSearches]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlaylistChange = (playlist: typeof PLAYLIST_1, id: PlaylistId) => {
    setCurrentPlaylist(playlist);
    setSelectedPlaylistId(id);
    // Set the first track of the new playlist as current
    if (playlist.length > 0) {
      dispatch({
        type: "SET_TRACK",
        payload: playlist[0],
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.4)*2)] my-4 bg-[#1A1A1A] text-white rounded-xl overflow-hidden border-black/20 border-2 border-[#28282833] mx-4">
      {/* Sidebar */}
      <div className="w-60 bg-black/50 backdrop-blur-lg border-r border-[#282828] flex flex-col">
        {/* Search Bar */}
        <div className="p-2">
          <div className="bg-[#28282833] rounded-md flex items-center px-3 py-1 border-[rgba(0,0,0,0.66)] border-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Playlists"
              value={playlistSearch}
              onChange={(e) => setPlaylistSearch(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full text-gray-100 bg-transparent"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="px-2 space-y-1">
          <button className="truncate w-full text-left px-2 py-1 text-sm border-2 border-[rgba(0,0,0,0.66)] hover:bg-[#282828] rounded flex items-center gap-2">
            <Radio className="w-4 h-4" />
            Listen Now
          </button>
          <button className="truncate w-full text-left px-2 py-1 text-sm border-2 border-[rgba(0,0,0,0.66)] hover:bg-[#282828] rounded flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recently Added
          </button>
        </div>

        {/* Playlists */}
        <div className="mt-4">
          <div className="px-4 py-2 text-[10px] font-semibold text-gray-400">Playlists</div>
          <div className="space-y-1 px-2">
            {filteredPlaylists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => handlePlaylistChange(playlist.tracks, playlist.id as any)}
                className={`truncate w-full text-left px-2 py-1 text-sm rounded flex items-center gap-2 bg-[rgba(0,0,0,0.5)] border-[rgba(0,0,0,0.66)] border-2 ${selectedPlaylistId === playlist.id ? "bg-[#282828]" : "hover:bg-[#282828]"}`}>
                <ListMusic className="w-4 h-4" />
                <span className="truncate">{playlist.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative ">
        <section className="absolute -inset-[9999px] pointer-events-none opacity-30">
          <Sonority.Current.Cover className="absolute pointer-events-none z-0 opacity-50 blur-[500px] top-0 left-0 w-full h-full object-cover backdrop-blur-[300px]" />
          <Sonority.Current.Cover className="absolute saturate-200 pointer-events-none z-0 opacity-10 blur-[400px] bottom-0 right-0 w-[100%] h-[100%] object-cover backdrop-blur-[300px]" />
          <Sonority.Current.Cover className="absolute saturate-200 pointer-events-none z-0 opacity-10 blur-[1000px] bottom-0 left-0 w-full h-full object-cover backdrop-blur-[500px]" />
        </section>
        {/* Top Bar */}
        <div className="h-12 flex relative z-10 items-center px-4 bg-black/0  border-[#282828]">
          <div className="flex items-center gap-4">
            <button className="p-1 hover:bg-[#282828] rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-grow" />
        </div>

        {/* Current Track Info */}
        <div className="p-8 z-10 relative">
          <div className="md:flex space-y-4 md:space-y-0 items-center gap-6">
            <div className="relative shadow-lg w-56 h-56 bg-[#282828] rounded-lg flex items-center justify-center">
              <Music className="w-24 h-24 text-gray-600" />
              <Sonority.Current.Cover className="shadow-lg absolute top-0 left-0 w-full h-full object-cover rounded" />
            </div>
            <div>
              <Sonority.Current.Track className="text-3xl font-bold truncate" />
              <Sonority.Current.Artist className="text-lg text-white/50 mt-1 truncate" />
              <Sonority.Current.VolumeGraph
                className="w-8 mt-4 text-white"
                gap={64}
                stroke="#ffffff66"
                strokeWidth={16}
              />
            </div>
          </div>
        </div>

        {/* Playlist Content */}
        <div className="flex-1 overflow-y-auto px-8 z-10 relative">
          <div className="mb-4">
            <div className="bg-[rgba(0,0,0,0.15)] border-[rgba(0,0,0,0.075)] border-2 rounded-md flex items-center px-3 py-1">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search in playlist"
                value={playlistTrackSearches[selectedPlaylistId]}
                onChange={(e) =>
                  setPlaylistTrackSearches((prev) => ({
                    ...prev,
                    [selectedPlaylistId]: e.target.value,
                  }))
                }
                className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full text-gray-200"
              />
            </div>
          </div>
          <Sonority.Playlist
            name={`Playlist ${selectedPlaylistId}`}
            className="space-y-1">
            {filteredTracks.map((track) => (
              <Sonority.Track
                key={track.id}
                {...track}
                className={`flex w-full text-left items-center p-2 px-4 rounded-md border border-[rgba(0,0,0,0)] ${state.currentTrack?.id === track.id ? "bg-[rgba(0,0,0,0.2)] backdrop-blur-lg border border-[rgba(0,0,0,0.075)] border-2 backdrop-blur-lg shadow" : "hover:bg-[rgba(0,0,0,0.1)] border-2 border-[rgba(0,0,0,0)]"} transition-colors`}>
                <div className="flex items-center flex-1 min-w-0">
                  <div className="flex-1 truncate">
                    <Sonority.Track.Title className="text-sm" />
                    <Sonority.Track.Artist className="text-xs text-gray-400" />
                  </div>
                  <Sonority.Track.VolumeGraph
                    className="w-8"
                    gap={64}
                    strokeWidth={16}
                  />
                  <div className="ml-4 text-xs text-gray-400">{track.duration}</div>
                </div>
              </Sonority.Track>
            ))}
          </Sonority.Playlist>
        </div>

        {/* Player Controls */}
        <div style={{
          
        }} className="h-24 bg-black/[0.225] backdrop-blur-lg border-t border-[#282828] pt-4">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            {/* Play Controls */}
            <div className="flex items-center gap-4 mb-2">
              <Sonority.Control.Shuffle className="text-gray-400 hover:text-white">
                <Shuffle className="w-5 h-5" />
              </Sonority.Control.Shuffle>

              <Sonority.Control.Previous className="text-gray-400 hover:text-white">
                <SkipBack className="w-5 h-5" />
              </Sonority.Control.Previous>

              <Sonority.Control.Play className="bg-white text-black rounded-full p-2 hover:scale-105 transition">{state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</Sonority.Control.Play>

              <Sonority.Control.Next className="text-gray-400 hover:text-white">
                <SkipForward className="w-5 h-5" />
              </Sonority.Control.Next>

              <Sonority.Control.Repeat className="text-gray-400 hover:text-white">
                <Repeat className="w-5 h-5" />
              </Sonority.Control.Repeat>

              {/* Added Volume Controls */}
              <div className="flex items-center gap-2 ml-4">
                <Sonority.Control.Mute className="text-gray-400 hover:text-white">{state.isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}</Sonority.Control.Mute>
                <Sonority.Control.Volume className="w-24 min-w-16" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full flex items-center gap-2 text-xs text-gray-400">
              <span>{formatTime(state.currentTime)}</span>
              <Sonority.Control.Seek className="flex-1" />
              <span>{formatTime(state.duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FullstackPlayer = () => {
  return (
    <Sonority variant="playlist">
      <FullstackContent />
    </Sonority>
  );
};

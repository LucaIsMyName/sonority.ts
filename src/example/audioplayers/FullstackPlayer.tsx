import { Sonority } from "../../index";
import { useTrackInfo, usePlaybackState, useVolumeState, usePlaylistState, usePlaybackControls } from "../../context/SonorityContext";
import { Play, Pause, Download, Share, Ellipsis, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, ListMusic, Radio, Search, Music } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

// Playlists Mock Data
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

// Separate component for current track display to prevent re-renders
const CurrentTrackDisplay = () => {
  const { currentTrack } = useTrackInfo();

  return (
    <div className="p-4 md:p-8 z-10 relative bg-gradient-to-b from-black/10 to-transparent">
      <div className="md:flex space-y-4 md:space-y-0 items-center gap-6">
        <div className="relative shadow-lg w-56 h-56 bg-[#282828] rounded-lg flex items-center justify-center">
          <Music className="w-24 h-24 text-gray-600" />
          <Sonority.Current.Cover className="shadow-lg transition-all absolute top-0 left-0 w-full h-full object-cover rounded" />
        </div>
        <div>
          <Sonority.Current.Track className="text-4xl font-medium truncate" />
          <Sonority.Current.Artist className="text-xl text-white/50 mt-1 truncate" />
        </div>
      </div>
    </div>
  );
};

// Separate component for playback controls
const PlaybackControls = () => {
  const { isPlaying } = useTrackInfo();
  const { currentTime, duration } = usePlaybackState();
  const { isMuted } = useVolumeState();
  const { queue } = usePlaylistState();  // Add this to check queue state
  const { dispatch } = usePlaybackControls();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-24 bg-black/[0.225] backdrop-blur-lg border-t border-[#282828] pt-4">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <div className="flex items-center gap-4 mb-2">
          <Sonority.Control.Shuffle className="text-white/40 hover:text-white">
            <Shuffle className="w-4 h-4" />
          </Sonority.Control.Shuffle>

          <Sonority.Control.Previous 
            className="text-white/40 hover:text-white disabled:opacity-50"
            disabled={queue.length <= 1}
            onClick={() => dispatch({ type: "PREVIOUS_TRACK" })}
          >
            <SkipBack className="w-4 h-4" />
          </Sonority.Control.Previous>

          <Sonority.Control.Play 
            className="bg-white text-black rounded-full p-2 hover:scale-105 transition"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Sonority.Control.Play>

          <Sonority.Control.Next 
            className="text-white/40 hover:text-white disabled:opacity-50"
            disabled={queue.length <= 1}
            onClick={() => dispatch({ type: "NEXT_TRACK" })}
          >
            <SkipForward className="w-4 h-4" />
          </Sonority.Control.Next>

          <Sonority.Control.Repeat className="text-white/40 hover:text-white">
            <Repeat className="w-4 h-4" />
          </Sonority.Control.Repeat>

          <div className="flex items-center gap-2 ml-4">
            <Sonority.Control.Mute className="text-white/40 hover:text-white">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Sonority.Control.Mute>
            <Sonority.Control.Volume className="w-24 min-w-16 text-white/40" />
          </div>
        </div>

        <div className="w-full flex items-center gap-2 text-xs text-white/40">
          <span>{formatTime(currentTime)}</span>
          <Sonority.Control.Seek className="flex-1" />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

// Separate component for playlist track
const PlaylistTrack = ({ track }: any) => {
  const { currentTrack } = useTrackInfo();
  const { dispatch } = usePlaybackControls();
  const { queue } = usePlaylistState();

  const handleClick = () => {
    // When clicking a track, ensure it's in the queue
    if (!queue.some((t) => t.id === track.id)) {
      dispatch({
        type: "SET_QUEUE",
        payload: [...queue, track],
      });
    }

    dispatch({
      type: "SET_TRACK",
      payload: track,
    });
  };

  return (
    <Sonority.Track
      {...track}
      onClick={handleClick}
      className={`flex w-full text-left items-center p-2 px-4 rounded-md ${currentTrack?.id === track.id ? "bg-[rgba(0,0,0,0.2)] backdrop-blur-lg border border-2 border-transparent backdrop-blur-lg shadow" : "hover:bg-[rgba(0,0,0,0.1)] border-2 border-[rgba(0,0,0,0)]"} transition-colors`}>
      <div className="flex items-center flex-1 min-w-0">
        <div className="flex-1 truncate">
          <Sonority.Track.Title className="text-white/90" />
          <Sonority.Track.Artist className="text-sm text-white/40" />
        </div>
        <Sonority.Track.VolumeGraph
          className="w-8"
          gap={64}
          strokeWidth={16}
        />
        <div className="ml-4 text-xs text-white/40">{track.duration}</div>
      </div>
    </Sonority.Track>
  );
};

// Main content component
const FullstackContent = () => {
  type PlaylistId = "1" | "2" | "3";
  const { dispatch } = usePlaybackControls();
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

  const handlePlaylistChange = (playlist: typeof PLAYLIST_1, id: PlaylistId) => {
    setCurrentPlaylist(playlist);
    setSelectedPlaylistId(id);
    
    // Update playlist
    dispatch({
      type: "SET_PLAYLIST",
      payload: {
        id,
        name: `Playlist ${id}`,
        tracks: playlist
      }
    });
  
    // Update queue
    dispatch({
      type: "SET_QUEUE",
      payload: playlist
    });
  
    // Set first track
    if (playlist.length > 0) {
      dispatch({
        type: "SET_TRACK",
        payload: playlist[0]
      });
    }
  };

  useEffect(() => {
    // Set initial playlist and queue
    dispatch({
      type: "SET_PLAYLIST",
      payload: {
        id: "1",
        name: "Playlist 1",
        tracks: PLAYLIST_1
      }
    });
  
    // Set queue explicitly
    dispatch({
      type: "SET_QUEUE",
      payload: PLAYLIST_1
    });
  
    // Set initial track
    if (PLAYLIST_1.length > 0) {
      dispatch({
        type: "SET_TRACK",
        payload: PLAYLIST_1[0]
      });
    }
  }, []); // Run once on mount

  return (
    <div className="flex h-[calc(100vh-theme(spacing.4)*2)] my-4 bg-[#1A1A1A] text-white rounded-xl overflow-hidden border-black/20 border-2 border-[#28282833] mx-4">
      {/* Sidebar */}
      <div className="w-full max-w-[clamp(240px,33vw,320px)] bg-black/50 backdrop-blur-lg shadow-inner flex flex-col">
        {/* Header */}
        <section>
          <div className="p-2 pb-0 flex items-center gap-2">
            <section className="flex gap-2 items-center w-full border-white/10 mb-2">
              <div className="size-8 shadow-sm flex items-center justify-center border border-white/90 rounded-md bg-white/90">
                <Radio
                  className="w-5 h-5 text-black/90"
                  strokeWidth={1.5}
                  style={{ transform: "rotate(45deg)" }}
                />
              </div>
              <span className="truncate">React Sonority</span>
            </section>
          </div>
        </section>

        {/* Playlist Search */}
        <div className="p-2">
          <div className="rounded-md flex items-center px-3 py-1 bg-[rgba(0,0,0,1)]">
            <Search className="w-4 h-4 text-white" />
            <input
              type="search"
              placeholder="Search Playlists"
              value={playlistSearch}
              onChange={(e) => setPlaylistSearch(e.target.value)}
              className="bg-transparent border-none placeholder:focus:text-white/30 focus:outline-none ml-2 w-full text-white/40"
            />
          </div>
        </div>

        {/* Playlist List */}
        <div className="mt-0">
          <div className="px-4 py-2 text-xs text-white/40 tracking-wide">Playlists</div>
          <div className="space-y-2 px-2">
            {filteredPlaylists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => handlePlaylistChange(playlist.tracks, playlist.id as PlaylistId)}
                className={`truncate w-full text-left px-2 py-1 rounded flex items-center gap-2 ${selectedPlaylistId === playlist.id ? "text-[#282828] bg-white/90" : "hover:bg-[#282828] bg-[rgba(0,0,0,0.5)]"}`}>
                <ListMusic
                  className="w-4 h-4"
                  strokeWidth={2}
                />
                <span className="truncate font-regular">{playlist.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative shadow-inner z-10">
        {/* Background Effects */}
        <section className="absolute -inset-[9999px] pointer-events-none opacity-30">
          <Sonority.Current.Cover className="absolute pointer-events-none z-0 opacity-50 blur-[500px] top-0 left-0 w-full h-full object-cover backdrop-blur-[300px]" />
          <Sonority.Current.Cover className="absolute saturate-200 pointer-events-none z-0 opacity-10 blur-[400px] bottom-0 right-0 w-[100%] h-[100%] object-cover backdrop-blur-[300px]" />
          <Sonority.Current.Cover className="absolute saturate-200 pointer-events-none z-0 opacity-10 blur-[1000px] bottom-0 left-0 w-full h-full object-cover backdrop-blur-[500px]" />
        </section>

        {/* Current Track Display */}
        <CurrentTrackDisplay />

        {/* Playlist Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 z-10 relative">
          {/* Search and Actions */}
          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <div className="bg-[rgba(0,0,0,0.2)] backdrop-blur-lg border-2 border-transparent rounded-md flex items-center px-3 py-1">
                <Search
                  strokeWidth={2.5}
                  className="w-4 h-4 text-white/40"
                />
                <input
                  type="search"
                  placeholder="Search in playlist"
                  value={playlistTrackSearches[selectedPlaylistId]}
                  onChange={(e) =>
                    setPlaylistTrackSearches((prev) => ({
                      ...prev,
                      [selectedPlaylistId]: e.target.value,
                    }))
                  }
                  className="bg-transparent border-none focus:outline-none ml-2 w-full text-white/40 placeholder:text-white/40 placeholder:focus:text-white/20 transition-colors"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.8)] bg-black/20 hover:bg-black/30 backdrop-blur-lg border-2 border-transparent rounded-md flex items-center px-3 py-2">
                <Download className="size-[1em]" />
              </button>
              <button className="text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.8)] bg-black/20 hover:bg-black/30 backdrop-blur-lg border-2 border-transparent rounded-md flex items-center px-3 py-2">
                <Share className="size-[1em]" />
              </button>
              <button className="text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.8)] bg-black/20 hover:bg-black/30 backdrop-blur-lg border-2 border-transparent rounded-md flex items-center px-3 py-2">
                <Ellipsis className="size-[1em]" />
              </button>
            </div>
          </div>

          {/* Tracks List */}
          <Sonority.Playlist
            name={`Playlist ${selectedPlaylistId}`}
            className="space-y-1">
            {filteredTracks.map((track) => (
              <PlaylistTrack
                key={track.id}
                track={track}
              />
            ))}
          </Sonority.Playlist>
        </div>

        {/* Player Controls */}
        <PlaybackControls />
      </div>
    </div>
  );
};

// Export the full player component
export const FullstackPlayer = () => {
  return (
    <Sonority variant="playlist">
      <FullstackContent />
    </Sonority>
  );
};

export default FullstackPlayer;

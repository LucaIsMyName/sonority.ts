# `<Sonority />`

A React Audio Player Component

A flexible, headless audio player component for React applications. Sonority provides a set of composable components to build custom audio players with ease.

## Installation

```bash
npm install react-sonority
# or
yarn add react-sonority
```

## Features

- 🎵 Single track and playlist support 
- 🎨 Fully customizable styling (headless)
- 🔄 Queue management and track navigation
- 🎛️ Volume and seek controls
- 🔁 Repeat and shuffle functionality
- 📱 Responsive and accessible
- 🎯 TypeScript support
- 🧩 Compound component architecture
- 🎨 Fully composable track rendering

## Quick Start

```jsx
import { Sonority } from 'react-sonority';

function App() {
  return (
    <Sonority variant="single" className="p-4">
      {/* Play/Pause Control */}
      <Sonority.Control is="play">
        {isPlaying ? 'Pause' : 'Play'}
      </Sonority.Control>

      {/* Track Information */}
      <Sonority.Current is="track" />
      <Sonority.Current is="artist" />

      {/* Progress Bar */}
      <Sonority.Control is="seek" />

      {/* Track Definition */}
      <Sonority.Track 
        src="/path/to/audio.mp3" 
        title="My Track"
        artist="Artist Name" 
      />
    </Sonority>
  );
}
```

## API Reference

### `<Sonority />`

The root component that provides audio context and state management.

#### Props
- `variant`: `"single" | "playlist" | "multiPlaylist"` 
- `className`: Additional CSS classes
- `children`: React nodes

```jsx
<Sonority 
  variant="single"
  className="your-custom-classes"
>
  {/* Child components */}
</Sonority>
```

### `<Sonority.Track />`

Represents an audio track with extensive metadata support.

#### Props
- `id`: Unique identifier for the track
- `src`: Path to the audio file
- `title`: Track title
- `artist`: Track artist
- `image`: Album artwork
  - `src`: Image URL
  - `alt`: Alternative text
- `album`: Album name
- `writtenBy`: Composer or writer
- `genre`: Music genre
- `year`: Release year
- `duration`: Track length
- `children`: Custom rendering of track information

#### Subcomponents
- `<Sonority.Track.Title>`: Render track title
- `<Sonority.Track.Artist>`: Render artist name
- `<Sonority.Track.Cover>`: Render track image
- `<Sonority.Track.Album>`: Render album name
- `<Sonority.Track.WrittenBy>`: Render composer
- `<Sonority.Track.Genre>`: Render genre
- `<Sonority.Track.Year>`: Render release year
- `<Sonority.Track.Duration>`: Render track length
- `<Sonority.Track.CustomProperty>`: Render custom metadata

```jsx
<Sonority.Track 
  id="unique-track-id"
  src="/audio/track.mp3"
  title="Cosmic Echoes"
  artist="Stellar Waves"
  image={{ 
    src: "/cover.jpg", 
    alt: "Album Artwork" 
  }}
  album="Interstellar Frequencies"
  writtenBy="Alex Stardust"
  genre="Electronic Ambient"
  year={2022}
  duration={245}
>
  {/* Custom rendering */}
  <div className="custom-track-layout">
    <Sonority.Track.Title className="text-xl" />
    <Sonority.Track.Artist className="text-sm" />
    <Sonority.Track.CustomProperty 
      name="mood" 
      className="italic text-gray-500" 
    />
  </div>
</Sonority.Track>
```

### `<Sonority.Control />`

Audio control components with various types.

#### Supported Control Types
- `"play"`: Play/Pause toggle
- `"pause"`: Pause playback
- `"next"`: Next track
- `"previous"`: Previous track
- `"seek"`: Progress/seek slider
- `"volume"`: Volume control
- `"shuffle"`: Toggle shuffle mode
- `"repeat"`: Toggle repeat modes

```jsx
{/* Play/Pause Button */}
<Sonority.Control is="play">
  {isPlaying ? <PauseIcon /> : <PlayIcon />}
</Sonority.Control>

{/* Seek Bar */}
<Sonority.Control is="seek" className="w-full" />

{/* Volume Control */}
<Sonority.Control is="volume" className="w-24" />
```

### `<Sonority.Current />`

Displays current track information.

#### Supported Types
- `"track"`: Current track title
- `"artist"`: Current track artist
- `"cover"`: Current track image
- `"album"`: Current album name
- `"writtenBy"`: Current track composer
- Custom metadata types

```jsx
<Sonority.Current is="track" className="text-xl" />
<Sonority.Current is="artist" className="text-sm" />
```

### `<Sonority.Playlist />`

Groups tracks into a playlist.

#### Props
- `id`: Unique playlist identifier
- `name`: Playlist name
- `className`: Additional CSS classes
- `children`: `<Sonority.Track />` components

```jsx
<Sonority.Playlist 
  id="my-playlist"
  name="Chill Vibes"
  className="space-y-2"
>
  <Sonority.Track {...track1} />
  <Sonority.Track {...track2} />
</Sonority.Playlist>
```

## Advanced Usage Examples

### Detailed Track Rendering

```jsx
<Sonority.Track {...trackData}>
  <div className="flex items-center">
    <Sonority.Track.Cover className="w-16 h-16 mr-4" />
    <div>
      <Sonority.Track.Title className="font-bold" />
      <Sonority.Track.Artist className="text-gray-600" />
      <Sonority.Track.Album className="text-sm" />
      <Sonority.Track.CustomProperty 
        name="mood" 
        className="italic text-gray-500" 
      />
    </div>
  </div>
</Sonority.Track>
```

### Playlist with Custom Styling

```jsx
<Sonority variant="playlist">
  <Sonority.Playlist id="my-playlist">
    {tracks.map(track => (
      <Sonority.Track 
        key={track.id} 
        {...track}
        className="hover:bg-gray-100 transition-colors"
      >
        <div className="flex justify-between items-center">
          <Sonority.Track.Title />
          <Sonority.Track.Duration className="text-sm text-gray-500" />
        </div>
      </Sonority.Track>
    ))}
  </Sonority.Playlist>
</Sonority>
```

## Styling and Customization

Sonority is completely headless with no default styles. Use `className` props or CSS-in-JS solutions for styling.

### Data Attributes for Styling
- `data-sonority-component`: Component type
- `data-sonority-component-is`: Component variant
- `data-sonority-current`: Current track
- `data-sonority-playing`: Playback state

## Browser Support

Compatible with all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS/Android latest)

## TypeScript Support

Full TypeScript type definitions included.

## License

MIT © `LucaIsMyName`

---

For more detailed examples and community support, visit our [GitHub Repository](https://github.com/LucaIsMyName/react-sonority).
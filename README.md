# `<Sonority />`

A Flexible, Headless React Audio Player Component

Sonority provides a powerful, composable audio player for React applications with full TypeScript support.

## Features

- 🎵 Single track and playlist support 
- 🎨 Fully customizable styling (headless)
- 🔄 Queue management and track navigation
- 🎛️ Volume and seek controls
- 🔁 Repeat and shuffle functionality
- 📱 Responsive and accessible
- 🎯 TypeScript support
- 🧩 Compound component architecture
- 🎨 Fully composable rendering

## Installation

```bash
npm install react-sonority
# or
yarn add react-sonority
```

## Quick Start

```jsx
import { Sonority } from 'react-sonority';

function AudioPlayer() {
  return (
    <Sonority variant="single" className="p-4">
      {/* Play/Pause Control */}
      <Sonority.Control.Play>
        {isPlaying ? 'Pause' : 'Play'}
      </Sonority.Control.Play>

      {/* Track Information */}
      <Sonority.Current.Track className="text-xl" />
      <Sonority.Current.Artist className="text-sm" />

      {/* Progress Bar */}
      <Sonority.Control.Seek className="w-full" />

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

## Comprehensive API Reference

### `<Sonority />`

The root component that provides audio context and state management.

#### Props
- `variant`: `"single" | "playlist" | "multiPlaylist"` 
- `className`: Additional CSS classes
- `children`: React nodes

### `<Sonority.Track />`

Represents an audio track with extensive metadata support.

#### Track Properties
- `id`: Unique identifier
- `src`: Audio file path
- `title`: Track title
- `artist?`: Artist name
- `image?`: Album artwork
  - `src`: Image URL
  - `alt?`: Alternative text
- `album?`: Album name
- `writtenBy?`: Composer or writer
- `genre?`: Music genre
- `year?`: Release year
- `duration?`: Track length

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

### `<Sonority.Current />`

Displays current track information with flexible rendering.

#### Subcomponents
- `<Sonority.Current.Track>`: Current track title
- `<Sonority.Current.Artist>`: Current track artist
- `<Sonority.Current.Cover>`: Current track image
- `<Sonority.Current.Album>`: Current album name
- `<Sonority.Current.WrittenBy>`: Current track composer
- `<Sonority.Current.Genre>`: Current track genre
- `<Sonority.Current.Year>`: Current track release year

### `<Sonority.Control />`

Audio control components with various interactions.

#### Subcomponents
- `<Sonority.Control.Play>`: Play/Pause toggle
- `<Sonority.Control.Previous>`: Previous track
- `<Sonority.Control.Next>`: Next track
- `<Sonority.Control.Seek>`: Progress slider
- `<Sonority.Control.Volume>`: Volume control
- `<Sonority.Control.Shuffle>`: Toggle shuffle mode
- `<Sonority.Control.Repeat>`: Toggle repeat modes

## Advanced Usage Examples

### Flexible Track Rendering

```jsx
<Sonority.Track {...trackData}>
  <div className="flex items-center">
    <Sonority.Track.Cover className="w-16 h-16 mr-4" />
    <div>
      <Sonority.Track.Title className="font-bold" />
      <Sonority.Track.Artist className="text-gray-600" />
      <Sonority.Track.CustomProperty 
        name="mood" 
        className="italic text-gray-500" 
      />
    </div>
  </div>
</Sonority.Track>
```

### Custom Playlist with Subcomponents

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

### Data Attributes
- `data-sonority-component`: Component type
- `data-sonority-variant`: Component variant
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

MIT © Lucas Mack

---

For more detailed examples and community support, visit our [GitHub Repository](https://github.com/LucaIsMyName/react-sonority).
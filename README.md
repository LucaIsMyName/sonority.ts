# `<Sonority />`

A Flexible, Headless React Audio Player.

## Features

- 🎵 Single track and playlist support 
- 🎨 Fully customizable styling (headless)
- 🔄 Queue management and track navigation
- 🎛️ Volume, seek, and playback speed controls
- 🔁 Repeat and shuffle functionality
- 📱 Responsive and accessible
- 🎯 TypeScript support
- 🧩 Compound component architecture
- 🎨 Fully composable rendering

## Installation

### npm 
```bash
npm install react-sonority @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-tooltip @radix-ui/react-progress @radix-ui/react-dropdown-menu
```

### yarn
```bash
yarn add react-sonority @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-tooltip @radix-ui/react-progress @radix-ui/react-dropdown-menu
```

## Quick Start

```jsx
import { Sonority, useSonority } from 'react-sonority';
import { Play as PlayIcon, Pause as PauseIcon } from "lucide-react";

function AudioPlayer() {
  const { state } = useSonority();

  return (
    <Sonority variant="playlist" className="p-4">
      {/* Play/Pause Control */}
      <Sonority.Control.Play>
        {state.isPlaying ? <PauseIcon /> : <PlayIcon />}
      </Sonority.Control.Play>

      {/* Track Information */}
      <Sonority.Current.Track className="text-xl" />
      <Sonority.Current.Artist className="text-sm" />

      {/* Progress Bar */}
      <Sonority.Control.Seek className="w-full" />

      {/* Volume Controls */}
      <Sonority.Control.Mute />
      <Sonority.Control.Volume className="w-24" />

      {/* Track Definition */}
      <Sonority.Playlist name="Rock'n'Roll">
        <Sonority.Track 
          src="./ohio.mp3" 
          title="Ohio"
          artist="The Black Keys" 
        />
        <Sonority.Track 
          src="./out-on-the-weekend.mp3" 
          title="Out on the Weekend"
          artist="Neil Young" 
        />
         <Sonority.Track 
          src="./the-hardest-cut.mp3" 
          title="The Hardest Cut"
          artist="Spoon" 
        />
      </Sonority.Playlist>
    </Sonority>
  );
}
```

## Comprehensive API Reference

### `<Sonority />`

The root component that provides audio context and state management.

#### Props
- `variant`: `"single" | "playlist"`
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
- `<Sonority.Control.Mute>`: Toggle audio muting
- `<Sonority.Control.Speed>`: Playback speed control with prop:
  - options: 
  ```ts
  {
    min: number,
    max: number,
    initial: number,
    steps: number,
    variant: string
  }
  ```

#### Speed Control
The Speed control supports three variants:
```jsx
// Range slider
<Sonority.Control.Speed
  options={{
    min: float,
    max: float,
    step: float,
    variant: "range"
  }}
  className="w-full"
/>

// Select dropdown
<Sonority.Control.Speed
  options={{
    variant: "select"
  }}
  className="p-2 border rounded"
/>

// Button group
<Sonority.Control.Speed
  options={{
    variant: "buttons"
  }}>
  {({ speeds, currentSpeed, setSpeed }) => (
    <div className="flex gap-2">
      {speeds.map(speed => (
        <button
          key={speed}
          onClick={() => setSpeed(speed)}
          className={currentSpeed === speed ? 'active' : ''}>
          {speed}x
        </button>
      ))}
    </div>
  )}
</Sonority.Control.Speed>
```

#### Speed Control Options
- `min`: Minimum speed (default: 0)
- `max`: Maximum speed (default: 2)
- `step`: Speed increment (default: 0.5)
- `variant`: "range" | "select" | "buttons"
- `default`: Default speed value (default: 1)

#### Mute Control
```jsx
import 
// Basic usage
<Sonority.Control.Mute />

// With custom content
<Sonority.Control.Mute>
  {isMuted ? 'Unmute' : 'Mute'}
</Sonority.Control.Mute>

// With initial state
<Sonority.Control.Mute initialMuted={true} />
```

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

MIT © LucaIsMyName

---

For more detailed examples and community support, visit our [GitHub Repository](https://github.com/LucaIsMyName/sonority.ts).
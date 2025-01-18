// SpeedControlExamples.tsx
import React from "react";
import { Play, Pause } from "lucide-react";
import { Sonority } from "../components/Sonority";
import { useSonority } from "../context/SonorityContext";

const sampleTrack = {
  id: "speed-demo",
  title: "Speed Control Demo",
  artist: "Demo Artist",
  src: "./audio/song-1.mp3",
};

// Range Variant Player
const RangeSpeedPlayer = () => {
  const { state } = useSonority();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Range Speed Control</h3>

      {/* Track Info and Play Button */}
      <div className="flex items-center space-x-4 mb-6">
        <Sonority.Control.Play className="p-2 rounded-full bg-blue-500 text-white">{state.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</Sonority.Control.Play>
        <div>
          <Sonority.Current.Track className="font-medium" />
          <div className="text-sm text-gray-500">Current Speed: {state.playbackRate}&times;</div>
        </div>
      </div>

      {/* Speed Control */}
      <Sonority.Control.Speed
        options={{
          min: 0,
          max: 4,
          steps: 0.1,
          variant: "range",
        }}
        className="w-full" // Remove unnecessary classes, let the internal styling handle it
      />

      {/* Initialize Track */}
      <Sonority.Playlist id="range-demo">
        <Sonority.Track
          className="flex gap-4"
          {...sampleTrack}>
          <Sonority.Track.Artist />
          <Sonority.Track.Title />
        </Sonority.Track>
      </Sonority.Playlist>
    </div>
  );
};

// Select Variant Player
const SelectSpeedPlayer = () => {
  const { state } = useSonority();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Dropdown Speed Control</h3>

      <div className="flex items-center space-x-4 mb-6">
        <Sonority.Control.Play className="p-2 rounded-full bg-green-500 text-white">{state.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</Sonority.Control.Play>
        <div>
          <Sonority.Current.Track className="font-medium" />
          <div className="text-sm text-gray-500">Current Speed: {state.playbackRate}&times;</div>
        </div>
      </div>

      <Sonority.Control.Speed
        options={{
          min: 0,
          max: 2,
          step: 0.2,
          variant: "select",
        }}
        className="w-full p-2 border rounded-md bg-white"
      />

      <Sonority.Playlist id="select-demo">
        <Sonority.Track {...sampleTrack} />
      </Sonority.Playlist>
    </div>
  );
};

// Buttons Variant Player
const ButtonsSpeedPlayer = () => {
  const { state } = useSonority();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Button Speed Controls</h3>

      <div className="flex items-center space-x-4 mb-6">
        <Sonority.Control.Play className="p-2 rounded-full bg-purple-500 text-white">{state.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</Sonority.Control.Play>
        <div>
          <Sonority.Current.Track className="font-medium" />
          <div className="text-sm text-gray-500">Current Speed: {state.playbackRate}&times;</div>
        </div>
      </div>

      <div className="space-y-4">
        <Sonority.Control.Speed
          options={{
            min: 0,
            max: 2,
            steps: 1,
            variant: "buttons",
          }}>
          {({ speeds, currentSpeed, setSpeed }: any): React.ReactNode => (
            <div className="flex flex-wrap gap-2">
              {speeds.map((speed: string) => (
                <button
                  key={speed}
                  onClick={() => setSpeed(speed)}
                  className={`px-3 py-1 rounded-full text-sm ${currentSpeed === speed ? "bg-purple-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}>
                  {speed.toString()}&times;
                </button>
              ))}
            </div>
          )}
        </Sonority.Control.Speed>
      </div>

      <Sonority.Playlist id="buttons-demo">
        {Array.from({ length: 5 }).map((_, index) => (
          <Sonority.Track
            key={index}
            className="block gap-4"
            {...sampleTrack}
            src={`./audio/song-${index + 1}.mp3`}
            title={`Track ${index + 1}`}
          />
        ))}
      </Sonority.Playlist>
    </div>
  );
};

// Container for all speed control examples
const SpeedControlExamples = () => {
  return (
    <div className="min-w-[320px] space-y-4 gap-8 md:grid-cols-1 lg:grid-cols-3">
      <Sonority variant="single">
        <RangeSpeedPlayer />
      </Sonority>

      <Sonority variant="single">
        <SelectSpeedPlayer />
      </Sonority>

      <Sonority variant="playlist">
        <ButtonsSpeedPlayer />
      </Sonority>
    </div>
  );
};

export default SpeedControlExamples;

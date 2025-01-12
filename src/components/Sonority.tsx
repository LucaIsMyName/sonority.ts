// src/components/Sonority.tsx
import React from "react";
import { SonorityProvider } from "../context/SonorityContext";
import { Current } from "./Current";
import { Control } from "./Control";
import { Playlist } from "./Playlist";
import { Track } from "./Track";

interface SonorityProps {
  variant?: "single" | "playlist" | "multiPlaylist";
  className?: string;
  children: React.ReactNode;
}

const SonorityBase: React.FC<SonorityProps> = ({ variant = "single", className, children }) => {
  return (
    <div
      data-sonority-component="player"
      data-sonority-variant={variant}
      className={className}>
      {children}
    </div>
  );
};

// Create the compound component with the provider built-in
const Sonority = Object.assign(
  ({ variant, className, children }: SonorityProps) => (
    <SonorityProvider id>
      <SonorityBase
        variant={variant}
        className={className}>
        {children}
      </SonorityBase>
    </SonorityProvider>
  ),
  {
    Current,
    Control,
    Playlist,
    Track,
  }
);

export { Sonority };

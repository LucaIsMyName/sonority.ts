import React from "react";
import { SonorityProvider } from "../context/SonorityContext";
import { Current } from "./Current";
import { Control } from "./Control";
import { Playlist } from "./Playlist";
import { Track } from "./Track";
import { Visualizer } from "./Visualizer";

interface SonorityProps {
  variant?: "single" | "playlist" | "multiPlaylist";
  className?: string;
  children: React.ReactNode | any;
  [key: string]: any;
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

const Sonority: SonorityProps | any = Object.assign(
  ({ variant, className, children }: SonorityProps | any) => (
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
    Visualizer,
  }
);

export { Sonority };
export default Sonority;

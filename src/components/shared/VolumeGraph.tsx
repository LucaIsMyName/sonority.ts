import React, { useMemo } from "react";
import { useSonority } from "../../context/SonorityContext";

export interface VolumeGraphProps {
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeLineCap?: "butt" | "round" | "square";
  gap?: number;
  className?: string;
  trackId?: string;
}

export const VolumeGraph: React.FC<VolumeGraphProps> = ({ width, height, stroke = "#707070", strokeWidth = 1, strokeLineCap = "round", gap = 22, className, trackId }) => {
  const { state } = useSonority();

  // Default viewBox dimensions
  const defaultWidth = 404;
  const defaultHeight = 211;

  // Generate sample volume data only once on mount using useMemo
  const volumeData = useMemo(() => {
    const counts = Math.floor((width || defaultWidth) / gap);
    const isCurrent = trackId === state.currentTrack?.id;

    return Array.from({ length: counts }, () => (isCurrent ? Math.random() * 0.8 + 0.4 : Math.random() * 0.6 + 0.2));
  }, []); // Empty dependency array means it only runs once on mount

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || "100%"}
      height={height || "100%"}
      viewBox={`0 0 ${defaultWidth} ${defaultHeight}`}
      preserveAspectRatio="xMidYMid meet"
      className={className}>
      <g>
        {volumeData.map((volume, index) => {
          const x = gap + index * gap;
          const lineHeight = volume * defaultHeight * 0.6;
          const y1 = (defaultHeight - lineHeight) / 2;
          const y2 = y1 + lineHeight;

          return (
            <line
              key={index}
              x1={x}
              y1={y1}
              x2={x}
              y2={y2}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap={strokeLineCap}
            />
          );
        })}
      </g>
    </svg>
  );
};

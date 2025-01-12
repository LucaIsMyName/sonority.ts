import React, { useState, useEffect } from "react";

interface VisualizerProps {
  className?: string;
  is?: "waves" | "lines" | "bars" | "circle" | "equalizer" | "none" | undefined;
}

/**
 * @description The Visualizer component
 * displays the audio visualizer
 * @param className The class name of the
 * @param is The type of the visualizer
 * */

export const Visualizer = ({ is, className }: VisualizerProps) => {
  return (
    <div
      data-sonority-component-is={is?.toString()}
      data-sonority-component="visualizer"
      className={className}></div>
  );
};

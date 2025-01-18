import React, { useRef, useEffect, useState } from "react";
import { useSonority } from "../context/SonorityContext";

interface VisualizerProps {
  className?: string;
  variant?: "waves" | "lines" | "bars" | "circle" | "equalizer" | "none" | undefined;
  width?: number;
  height?: number;
  color?: string;
}

/**
 * 
 * @param variant - The type of visualizer to render. Can be "waves", "lines", "bars", "circle", "equalizer", or "none".
 * @param className - Additional CSS classes to apply to the canvas element.
 * @param width - The width of the visualizer canvas.
 * @param height - The height of the visualizer canvas.
 * @param color - The color of the visualizer bars, lines, or waves.
 * @returns A visualizer component that renders audio frequency data in a canvas element.
 * @example
 * ```tsx
 * <Visualizer variant="bars" width={300} height={150} color="#4ade80" />
 * ```
 * 
 */
export const Visualizer = ({ variant = "bars", className = "", width = 300, height = 150, color = "#4ade80" }: VisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    // Create audio context and analyzer
    const initAudio = async () => {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyzerNode = audioCtx.createAnalyser();
      analyzerNode.fftSize = 256;

      try {
        const {state} = useSonority();
        // Get audio element (assuming it exists in the DOM with data-sonority-audio)
        const audioElement = document.querySelector(`[data-sonority-audio=${state.currentTrack?.src}]`) as HTMLAudioElement;
        if (audioElement) {
          const source = audioCtx.createMediaElementSource(audioElement);
          source.connect(analyzerNode);
          analyzerNode.connect(audioCtx.destination);
        }
      } catch (error) {
        console.error("Error connecting to audio source:", error);
      }

      setAudioContext(audioCtx);
      setAnalyser(analyzerNode);
      setDataArray(new Uint8Array(analyzerNode.frequencyBinCount));
    };

    initAudio();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const drawBars = (ctx: CanvasRenderingContext2D, data: Uint8Array) => {
    const barWidth = width / data.length;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / 255) * height;
      ctx.fillStyle = color;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
    }
  };

  const drawWaves = (ctx: CanvasRenderingContext2D, data: Uint8Array) => {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, height / 2);

    for (let i = 0; i < data.length; i++) {
      const x = (i / data.length) * width;
      const y = ((data[i] / 255) * height) / 2 + height / 4;
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, data: Uint8Array) => {
    ctx.clearRect(0, 0, width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const angle = (i / data.length) * Math.PI * 2;
      const amplitude = (data[i] / 255) * radius;
      const x = centerX + (radius + amplitude) * Math.cos(angle);
      const y = centerY + (radius + amplitude) * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawLines = (ctx: CanvasRenderingContext2D, data: Uint8Array) => {
    ctx.clearRect(0, 0, width, height);
    const lineSpacing = width / (data.length - 1);

    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = i * lineSpacing;
      const amplitude = (data[i] / 255) * height;
      ctx.moveTo(x, height);
      ctx.lineTo(x, height - amplitude);
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawEqualizer = (ctx: CanvasRenderingContext2D, data: Uint8Array) => {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / 32;
    const smoothedData = new Array(32).fill(0);

    // Average the frequency data to get smoother bars
    for (let i = 0; i < 32; i++) {
      const dataIndex = Math.floor((i / 32) * data.length);
      smoothedData[i] = data[dataIndex];
    }

    for (let i = 0; i < 32; i++) {
      const barHeight = (smoothedData[i] / 255) * height;
      const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color + "44");

      ctx.fillStyle = gradient;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
    }
  };

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const data = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      analyser.getByteFrequencyData(data);

      switch (variant) {
        case "waves":
          drawWaves(ctx, data);
          break;
        case "lines":
          drawLines(ctx, data);
          break;
        case "circle":
          drawCircle(ctx, data);
          break;
        case "equalizer":
          drawEqualizer(ctx, data);
          break;
        case "bars":
        default:
          drawBars(ctx, data);
          break;
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, variant, color, width, height]);

  return (
    <canvas
      data-sonority-component={`Visualizer?is=${variant?.toString()}`}
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
    />
  );
};

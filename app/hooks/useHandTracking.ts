"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { MediaPipeHands, MediaPipeResults } from "../types/mediapipe";
import type { HandTrackingResult } from "../types/hand";
import { useMediaPipeScript } from "./useMediaPipeScript";

interface UseHandTrackingOptions {
  maxHands?: number;
  modelComplexity?: 0 | 1;
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
}

export function useHandTracking(
  onResults: (result: HandTrackingResult) => void,
  options: UseHandTrackingOptions = {}
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const animationFrameRef = useRef<number>(0);
  const handsRef = useRef<MediaPipeHands | null>(null);
  const { loaded: scriptLoaded, error: scriptError } = useMediaPipeScript();

  const {
    maxHands = 2,
    modelComplexity = 1,
    minDetectionConfidence = 0.7,
    minTrackingConfidence = 0.5,
  } = options;

  const handleResults = useCallback(
    (results: MediaPipeResults) => {
      onResults({
        hands: results.multiHandLandmarks ?? [],
        image: results.image,
      });
    },
    [onResults]
  );

  const start = useCallback(async () => {
    try {
      if (!videoRef.current || !window.Hands) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      const hands = new window.Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: maxHands,
        modelComplexity,
        minDetectionConfidence,
        minTrackingConfidence,
      });

      hands.onResults(handleResults);
      handsRef.current = hands;

      const processFrame = async () => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          await hands.send({ image: videoRef.current });
        }
        animationFrameRef.current = requestAnimationFrame(processFrame);
      };

      animationFrameRef.current = requestAnimationFrame(processFrame);
      setActive(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Camera failed";
      setError(message);
    }
  }, [handleResults, maxHands, modelComplexity, minDetectionConfidence, minTrackingConfidence]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((track) => track.stop());
      handsRef.current?.close();
    };
  }, []);

  return {
    videoRef,
    active,
    error: error ?? scriptError,
    scriptLoaded,
    start,
  };
}
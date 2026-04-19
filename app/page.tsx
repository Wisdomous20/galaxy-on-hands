"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Hands, Results } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [handsDetected, setHandsDetected] = useState(0);

  // This fires every time MediaPipe processes a frame
  const onResults = useCallback((results: Results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // Clear the canvas each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the mirrored video feed onto the canvas
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(results.image, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    const landmarks = results.multiHandLandmarks;
    setHandsDetected(landmarks?.length ?? 0);

    if (landmarks) {
      for (const hand of landmarks) {
        // Draw each of the 21 landmarks as a small dot
        for (const point of hand) {
          // point.x and point.y are normalized 0-1,
          // so we multiply by canvas dimensions
          const x = (1 - point.x) * canvas.width; // mirror x
          const y = point.y * canvas.height;

          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(127, 239, 189, 0.8)";
          ctx.fill();
        }
      }
    }
  }, []);

  const startCamera = async () => {
    try {
      if (!videoRef.current || !canvasRef.current) return;

      // 1. Initialize MediaPipe Hands
      const hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1, // 0 = lite, 1 = full (more accurate)
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      });

      // 2. Register our callback
      hands.onResults(onResults);

      // 3. Use MediaPipe's Camera utility to feed frames
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current! });
        },
        width: 640,
        height: 480,
      });

      await camera.start();
      setCameraActive(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Camera failed";
      setError(message);
    }
  };

  useEffect(() => {
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-[#0a0a0f]">
      {!cameraActive && !error && (
        <button
          onClick={startCamera}
          className="px-8 py-3 border border-white/10 text-white/50 
                     font-mono text-sm tracking-widest uppercase
                     hover:bg-white/5 hover:border-white/20 transition-all"
        >
          Enable Camera
        </button>
      )}

      {error && <p className="text-red-400 font-mono text-sm">{error}</p>}

      {/* Hidden video — MediaPipe reads from this */}
      <video ref={videoRef} autoPlay playsInline className="hidden" />

      {/* Visible canvas — we draw video + landmarks here */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className={`rounded-lg border border-white/10 
                    ${cameraActive ? "block" : "hidden"}`}
      />

      {cameraActive && (
        <div className="mt-4 font-mono text-xs text-white/30 text-center">
          <p>hands detected: {handsDetected}</p>
          <p className="mt-1 text-white/20">
            21 landmarks per hand — each green dot is a joint
          </p>
        </div>
      )}
    </main>
  );
}

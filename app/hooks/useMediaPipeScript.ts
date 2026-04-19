"use client";

import { useState, useEffect } from "react";

const SCRIPT_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";

export function useMediaPipeScript() {
const [loaded, setLoaded] = useState(() => {
  if (typeof window === "undefined") return false;
  return !!window.Hands;
});  
const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loaded) return;

    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;

    script.onload = () => setLoaded(true);
    script.onerror = () => setError("Failed to load MediaPipe Hands");

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [loaded]);

  return { loaded, error };
}
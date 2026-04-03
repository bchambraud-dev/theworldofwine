import { useState, useEffect } from "react";

const loadingMessages = [
  "This needs to breathe…",
  "Waiting for the tannins to settle…",
  "Letting it decant…",
  "Swirling the glass…",
  "Checking the vintage…",
  "Uncorking something special…",
  "Nosing the bouquet…",
  "Ageing gracefully…",
  "Finding the right pairing…",
  "Polishing the stemware…",
  "Turning the bottle…",
  "Reading the terroir…",
  "Letting the sediment settle…",
  "Warming to room temperature…",
];

interface WineLoaderProps {
  size?: "sm" | "md" | "lg";
}

export default function WineLoader({ size = "md" }: WineLoaderProps) {
  const [msgIndex, setMsgIndex] = useState(
    () => Math.floor(Math.random() * loadingMessages.length)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const dotSize = size === "sm" ? 6 : size === "lg" ? 12 : 8;
  const fontSize = size === "sm" ? "0.65rem" : size === "lg" ? "0.85rem" : "0.72rem";

  return (
    <div className="wine-loader" data-testid="wine-loader">
      <div className="wl-dots">
        <span className="wl-dot" style={{ width: dotSize, height: dotSize, animationDelay: "0s" }} />
        <span className="wl-dot" style={{ width: dotSize, height: dotSize, animationDelay: "0.15s" }} />
        <span className="wl-dot" style={{ width: dotSize, height: dotSize, animationDelay: "0.3s" }} />
      </div>
      <p className="wl-msg" style={{ fontSize }} key={msgIndex}>
        {loadingMessages[msgIndex]}
      </p>
    </div>
  );
}

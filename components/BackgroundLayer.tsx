"use client";

import { useEffect, useState } from "react";
import { useBackground } from "@/contexts/BackgroundContext";

// Deterministic values seeded by index — avoids hydration mismatch
function seed(i: number, mod: number, offset = 0) {
  return ((i * 137 + offset * 31) % mod);
}
// Negative delay puts the animation mid-flight on page load
function negDelay(i: number, dur: number) {
  const pct = seed(i, 100, 9) / 100; // 0–0.99
  return -(pct * dur).toFixed(1);
}

/* ─── Balloons ─── */
const BALLOON_EMOJIS = ["🎈", "🎈", "🎈", "🎀", "🎈"];
const BALLOON_COUNT = 14;

function BalloonBg() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0">
      {Array.from({ length: BALLOON_COUNT }, (_, i) => {
        const left  = 3 + seed(i, 88, 0);
        const dur   = 9 + seed(i, 8, 2);           // 9–16s
        const size  = 22 + seed(i, 22, 3);
        const emoji = BALLOON_EMOJIS[i % BALLOON_EMOJIS.length];
        const delay = negDelay(i, dur);             // start mid-flight
        return (
          <div
            key={i}
            className="absolute top-0 select-none"
            style={{
              left: `${left}%`,
              fontSize: size,
              animationName: "float-balloon",
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
            }}
          >
            {emoji}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Sparkles ─── */
const SPARKLE_SHAPES = ["✦", "✧", "★", "✨", "✦", "⋆"];
const SPARKLE_COUNT = 30;
const SPARKLE_COLORS = [
  "#5C9470", "#A4D4B0", "#7BC4A0", "#3D7A5C",
  "#B2DFDB", "#80CBC4", "#FFD700", "#FFF9C4",
];

function SparklesBg() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0">
      {Array.from({ length: SPARKLE_COUNT }, (_, i) => {
        const left   = seed(i, 95, 0);
        const top    = seed(i, 90, 1);
        const delay  = (seed(i, 60, 2) / 10).toFixed(1);
        const dur    = (1.5 + seed(i, 30, 3) / 10).toFixed(1);
        const size   = 10 + seed(i, 18, 4);
        const color  = SPARKLE_COLORS[i % SPARKLE_COLORS.length];
        const shape  = SPARKLE_SHAPES[i % SPARKLE_SHAPES.length];
        return (
          <span
            key={i}
            className="absolute select-none font-bold"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              fontSize: size,
              color,
              animationName: "sparkle-pop",
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
            }}
          >
            {shape}
          </span>
        );
      })}
    </div>
  );
}

/* ─── Flowers ─── */
const PETAL_EMOJIS = ["🌸", "🌼", "🌺", "🌻", "🌷", "🌸", "💐"];
const PETAL_COUNT = 18;

function FlowersBg() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0">
      {Array.from({ length: PETAL_COUNT }, (_, i) => {
        const left  = 2 + seed(i, 90, 0);
        const dur   = 6 + seed(i, 8, 2);
        const size  = 18 + seed(i, 20, 3);
        const emoji = PETAL_EMOJIS[i % PETAL_EMOJIS.length];
        const delay = negDelay(i, dur);
        return (
          <div
            key={i}
            className="absolute top-0 select-none"
            style={{
              left: `${left}%`,
              fontSize: size,
              animationName: "petal-fall",
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
              animationTimingFunction: "ease-in",
              animationIterationCount: "infinite",
            }}
          >
            {emoji}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main layer ─── */
export default function BackgroundLayer() {
  const { background } = useBackground();
  if (background === "none") return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
      {background === "balloons" && <BalloonBg />}
      {background === "sparkles" && <SparklesBg />}
      {background === "flowers"  && <FlowersBg />}
    </div>
  );
}

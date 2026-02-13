"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const HEART_EMOJIS = ["🧛‍♂️", "🧟‍♂️", "🦖", "🐉", "🦇", "👻", "💀", "☠️", "👹", "🧌"];

// Pre-computed values to avoid Math.random() hydration mismatch
const HEARTS_DATA = [
  { left: 5, delay: 0.2, duration: 5.1, size: 1.3 },
  { left: 12, delay: 1.8, duration: 4.5, size: 2.1 },
  { left: 20, delay: 3.4, duration: 6.2, size: 1.6 },
  { left: 28, delay: 0.7, duration: 3.8, size: 1.9 },
  { left: 35, delay: 2.5, duration: 5.5, size: 1.1 },
  { left: 42, delay: 4.1, duration: 4.2, size: 2.4 },
  { left: 50, delay: 1.3, duration: 6.8, size: 1.4 },
  { left: 58, delay: 3.9, duration: 3.5, size: 2.0 },
  { left: 65, delay: 0.5, duration: 5.9, size: 1.7 },
  { left: 72, delay: 2.1, duration: 4.8, size: 1.2 },
  { left: 8, delay: 4.6, duration: 3.3, size: 2.3 },
  { left: 15, delay: 1.0, duration: 6.5, size: 1.5 },
  { left: 25, delay: 3.2, duration: 4.0, size: 1.8 },
  { left: 38, delay: 0.9, duration: 5.7, size: 2.2 },
  { left: 48, delay: 2.8, duration: 3.6, size: 1.0 },
  { left: 55, delay: 4.4, duration: 6.1, size: 1.6 },
  { left: 68, delay: 1.6, duration: 4.4, size: 2.5 },
  { left: 78, delay: 3.7, duration: 5.3, size: 1.3 },
  { left: 85, delay: 0.3, duration: 3.9, size: 2.1 },
  { left: 93, delay: 2.3, duration: 6.7, size: 1.8 },
];

function FloatingHearts() {
  return (
    <div className="floating-hearts" aria-hidden="true">
      {HEARTS_DATA.map((h, i) => (
        <span
          key={i}
          className="floating-heart"
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            fontSize: `${h.size}rem`,
          }}
        >
          {HEART_EMOJIS[i % HEART_EMOJIS.length]}
        </span>
      ))}
    </div>
  );
}

function CelebrationScreen() {
  return (
    <div className="celebration-container">
      <FloatingHearts />
      <div className="celebration-content">
        <div className="celebration-heart"></div>
        <h1 className="celebration-title">Excelente mujajajajaja! 🎉</h1>
        <p className="celebration-text">
          Sabía que dirías que sí! :D
        </p>
        <p className="celebration-subtext">
          feli, feli, feli, feli :b
        </p>
        <div className="celebration-emoji-row">
          ⚰️ 🧨 😑 🎊 🦕 🐢
        </div>
        <p className="celebration-date">
          Happy Valentine&apos;s Day 2026! 💝
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [noCount, setNoCount] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const yesBtnRef = useRef<HTMLButtonElement>(null);
  const justTappedNo = useRef(false);

  const yesScale = Math.min(1 + noCount * 0.1, 2);

  const moveNoButton = useCallback(() => {
    const btn = noBtnRef.current;
    const yesBtn = yesBtnRef.current;
    if (!btn) return;

    const btnW = btn.offsetWidth;
    const btnH = btn.offsetHeight;
    const margin = 12;
    const pad = 20; // extra padding around Yes button

    const maxX = window.innerWidth - btnW - margin;
    const maxY = window.innerHeight - btnH - margin;

    // Get Yes button rect to avoid overlapping it
    const yesRect = yesBtn?.getBoundingClientRect();

    const overlapsYes = (x: number, y: number) => {
      if (!yesRect) return false;
      return !(
        x + btnW < yesRect.left - pad ||
        x > yesRect.right + pad ||
        y + btnH < yesRect.top - pad ||
        y > yesRect.bottom + pad
      );
    };

    let newX: number;
    let newY: number;
    let attempts = 0;

    do {
      newX = margin + Math.random() * Math.max(maxX - margin, 0);
      newY = margin + Math.random() * Math.max(maxY - margin, 0);
      attempts++;
    } while (overlapsYes(newX, newY) && attempts < 50);

    btn.style.position = "fixed";
    btn.style.left = `${newX}px`;
    btn.style.top = `${newY}px`;
    btn.style.transition = "all 0.15s ease-out";
  }, []);

  const handleNoInteraction = useCallback(() => {
    justTappedNo.current = true;
    setNoCount((prev) => prev + 1);
    moveNoButton();
    setTimeout(() => { justTappedNo.current = false; }, 400);
  }, [moveNoButton]);

  const handleYes = useCallback(() => {
    if (justTappedNo.current) return;
    // Send notification through our own API route (avoids ad blockers)
    fetch("/api/notify", { method: "POST", keepalive: true }).catch(() => {});
    setAccepted(true);
  }, []);

  // Reset no button position if window resizes
  useEffect(() => {
    const handleResize = () => {
      const btn = noBtnRef.current;
      if (btn && btn.style.position === "fixed") {
        btn.style.position = "";
        btn.style.left = "";
        btn.style.top = "";
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (accepted) {
    return <CelebrationScreen />;
  }

  return (
    <div className="proposal-container">
      <FloatingHearts />
      <div className="proposal-content">
        <video
          className="proposal-video"
          src="/ye.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="buttons-area">
          <button
            ref={yesBtnRef}
            className="btn-yes"
            onClick={handleYes}
            style={{ transform: `scale(${yesScale})` }}
          >
            Yes! 💖
          </button>
          <button
            ref={noBtnRef}
            className="btn-no"
            onClick={handleNoInteraction}
            onMouseEnter={handleNoInteraction}
            onTouchStart={handleNoInteraction}
          >
            {noCount === 0 ? "No 😅" : "No 😭"}
          </button>
        </div>
      </div>
    </div>
  );
}

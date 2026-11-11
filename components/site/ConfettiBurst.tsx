"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#e42313", "#ffc20e", "#0e90a6", "#0b3c66"];
const PARTICLE_COUNT = 140;
const LIFETIME_MS = 2800;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
};

export default function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const originX = canvas.width / 2;
    const originY = canvas.height * 0.25;

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: originX,
      y: originY,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -15 - 4,
      size: Math.random() * 6 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 14,
    }));

    let raf: number;
    let elapsed = 0;
    let lastTime = performance.now();

    function tick(now: number) {
      const dt = Math.min(now - lastTime, 32);
      lastTime = now;
      elapsed += dt;

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const fade = Math.max(0, 1 - elapsed / LIFETIME_MS);

      for (const p of particles) {
        p.vx *= 0.99;
        p.vy = p.vy * 0.99 + 0.35;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rotation * Math.PI) / 180);
        ctx!.globalAlpha = fade;
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx!.restore();
      }

      if (elapsed < LIFETIME_MS) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    />
  );
}

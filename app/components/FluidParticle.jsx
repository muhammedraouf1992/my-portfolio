// components/OrganicFluidEffect.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

class FluidParticle {
  constructor(x, y, vx, vy, ctx) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;

    // Inherit velocity from mouse movement
    this.vx = vx + (Math.random() - 0.5) * 40;
    this.vy = vy + (Math.random() - 0.5) * 40;

    // Properties for organic look
    this.size = Math.random() * 4 + 4;
    this.opacity = 0.8;
    this.life = 1;
    this.decay = Math.random() * 0.005 + 0.005;

    // Color variation for depth
    this.hue = 150 + Math.random() * 40; // Blue-cyan range
    this.brightness = 50 + Math.random() * 30;
  }

  update() {
    // Smooth deceleration (less friction for more fluid movement)
    this.vx *= 0.9;
    this.vy *= 0.9;

    // Add slight turbulence for organic movement
    this.vx += (Math.random() - 0.5) * 0.3;
    this.vy += (Math.random() - 0.5) * 0.3;

    this.x += this.vx;
    this.y += this.vy;

    // Fade out
    this.life -= this.decay;
    this.opacity = this.life * 0.8;
    this.size = Math.max(0.5, this.size * 0.98);
  }

  draw() {
    this.ctx.save();

    // Large soft glow
    this.ctx.shadowBlur = 25;
    this.ctx.shadowColor = `hsla(${this.hue}, 80%, ${this.brightness}%, ${this.opacity * 0.6})`;

    // Draw soft circle
    const gradient = this.ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size * 3,
    );
    gradient.addColorStop(
      0,
      `hsla(${this.hue}, 90%, ${this.brightness}%, ${this.opacity})`,
    );
    gradient.addColorStop(
      0.5,
      `hsla(${this.hue}, 85%, ${this.brightness - 10}%, ${this.opacity * 0.4})`,
    );
    gradient.addColorStop(
      1,
      `hsla(${this.hue}, 80%, ${this.brightness - 20}%, 0)`,
    );

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  isDead() {
    return this.life <= 0;
  }
}

export default function OrganicFluidEffect() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const lastMouseRef = useRef({ x: 0, y: 0, time: Date.now() });
  const mouseTrailRef = useRef([]);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef("dark");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    themeRef.current = resolvedTheme || "dark";
  }, [resolvedTheme]);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    const animate = () => {
      // Slow fade for trail effect — black on dark, white on light
      ctx.fillStyle = themeRef.current === "dark"
        ? "rgba(0, 0, 0, 0.05)"
        : "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw all particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const particle = particlesRef.current[i];
        particle.update();
        particle.draw();

        if (particle.isDead()) {
          particlesRef.current.splice(i, 1);
        }
      }

      // Draw soft connections between nearby particles for organic feel
      ctx.lineWidth = 1;
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            const opacity =
              (1 - distance / 80) * Math.min(p1.opacity, p2.opacity) * 0.3;

            ctx.strokeStyle = `rgba(100, 200, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      if (window.scrollY >= window.innerHeight / 2) return;

      const currentTime = Date.now();
      const x = e.clientX;
      const y = e.clientY;

      // Calculate velocity based on mouse movement
      const dt = Math.max(currentTime - lastMouseRef.current.time, 1);
      const vx = ((x - lastMouseRef.current.x) / dt) * 16; // Normalize to ~60fps
      const vy = ((y - lastMouseRef.current.y) / dt) * 16;

      const speed = Math.sqrt(vx * vx + vy * vy);

      // Add to mouse trail for smooth interpolation
      mouseTrailRef.current.push({ x, y, vx, vy, time: currentTime });
      if (mouseTrailRef.current.length > 5) {
        mouseTrailRef.current.shift();
      }

      // Create particles continuously along the path
      const particleCount = Math.max(3, Math.min(Math.floor(speed / 3), 15));

      for (let i = 0; i < particleCount; i++) {
        // Interpolate between previous and current position
        const t = i / particleCount;
        const px = lastMouseRef.current.x + (x - lastMouseRef.current.x) * t;
        const py = lastMouseRef.current.y + (y - lastMouseRef.current.y) * t;

        particlesRef.current.push(new FluidParticle(px, py, vx, vy, ctx));
      }

      // Limit total particles for performance
      if (particlesRef.current.length > 300) {
        particlesRef.current.splice(0, particlesRef.current.length - 300);
      }

      lastMouseRef.current = { x, y, time: currentTime };
    };

    const handleClick = (e) => {
      if (window.scrollY >= window.innerHeight / 2) return;

      const x = e.clientX;
      const y = e.clientY;

      // Create burst effect on click
      for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 * i) / 30;
        const speed = Math.random() * 8 + 4;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        particlesRef.current.push(new FluidParticle(x, y, vx, vy, ctx));
      }
    };

    const handleScroll = () => {
      if (window.scrollY >= window.innerHeight / 2) {
        particlesRef.current = [];
        mouseTrailRef.current = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.opacity = "0";
      } else {
        canvas.style.opacity = "1";
      }
    };

    animate();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", setCanvasSize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("scroll", handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particlesRef.current = [];
      mouseTrailRef.current = [];
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        mixBlendMode: resolvedTheme === "dark" ? "screen" : "multiply",
        transition: "opacity 0.4s ease",
      }}
    />
  );
}

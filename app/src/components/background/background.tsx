"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import styled from "styled-components";

const BG = styled.div`
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

const StarCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

interface BackgroundProps {
  children: ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const starColors = [
      "rgba(255, 255, 255, 0.8)",
      "rgba(255, 255, 200, 0.7)",
      "rgba(230, 230, 250, 0.6)",
      "rgba(255, 250, 205, 0.7)",
      "rgba(240, 248, 255, 0.5)",
    ];

    const createStars = (count: number) => {
      const stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2.5,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
      return stars;
    };

    const drawStars = (
      stars: Array<{
        x: number;
        y: number;
        radius: number;
        vx: number;
        vy: number;
        color: string;
      }>
    ) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
      });
    };

    const animate = (
      stars: Array<{
        x: number;
        y: number;
        radius: number;
        vx: number;
        vy: number;
        color: string;
      }>
    ) => {
      drawStars(stars);
      animationFrameId = requestAnimationFrame(() => animate(stars));
    };

    resizeCanvas();
    const stars = createStars(70);
    animate(stars);

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <BG>
      <StarCanvas ref={canvasRef} />
      {children}
    </BG>
  );
};

export default Background;

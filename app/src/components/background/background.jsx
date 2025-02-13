'use client'

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const DarkBackground = styled.div`
  background-color: black;
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
`;

const DarkBackgroundComponent = ({ children }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Star types with more variety
    const starTypes = [
      // Classic circular stars
      {
        draw: (ctx, x, y, radius, color) => {
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      },
      // Twinkling stars with slight opacity variation
      {
        draw: (ctx, x, y, radius, color) => {
          ctx.beginPath();
          ctx.globalAlpha = 0.7 + Math.random() * 0.3;
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      },
      // Star with points
      {
        draw: (ctx, x, y, radius, color) => {
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5;
            const pointRadius = radius * (i % 2 === 0 ? 1 : 0.5);
            ctx.lineTo(
              x + Math.cos(angle) * pointRadius,
              y + Math.sin(angle) * pointRadius
            );
          }
          ctx.closePath();
          ctx.fill();
        }
      }
    ];

    // Color palette for stars
    const starColors = [
      'rgba(255, 255, 255, 0.8)',   // Pure white
      'rgba(255, 255, 200, 0.7)',   // Soft yellow-white
      'rgba(230, 230, 250, 0.6)',   // Pale lavender-white
      'rgba(255, 250, 205, 0.7)',   // Light golden
      'rgba(240, 248, 255, 0.5)'    // Alice blue
    ];

    const createStars = (count) => {
      const stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2.5,
          vx: Math.random() * 0.1 - 0.05,
          vy: Math.random() * 0.1 - 0.05,
          type: starTypes[Math.floor(Math.random() * starTypes.length)],
          color: starColors[Math.floor(Math.random() * starColors.length)]
        });
      }
      return stars;
    };

    const drawStars = (stars) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        ctx.fillStyle = star.color;
        star.type.draw(ctx, star.x, star.y, star.radius, star.color);

        star.x += star.vx;
        star.y += star.vy;

        // Wrap around screen edges
        star.x = (star.x + canvas.width) % canvas.width;
        star.y = (star.y + canvas.height) % canvas.height;
      });
    };

    const animate = (stars) => {
      drawStars(stars);
      animationFrameId = requestAnimationFrame(() => animate(stars));
    };

    resizeCanvas();
    const stars = createStars(70);
    animate(stars);

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <DarkBackground>
      <StarCanvas ref={canvasRef} />
      {children}
    </DarkBackground>
  );
};

export default DarkBackgroundComponent;

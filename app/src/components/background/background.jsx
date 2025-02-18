'use client'

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const DarkBackground = styled.div`
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

    const starTypes = [
      {
        draw: (ctx, x, y, radius, color) => {
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      },
      {
        draw: (ctx, x, y, radius, color) => {
          ctx.beginPath();
          ctx.globalAlpha = 0.7 + Math.random() * 0.3;
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      },
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

    const starColors = [
      'rgba(255, 255, 255, 0.8)',
      'rgba(255, 255, 200, 0.7)',
      'rgba(230, 230, 250, 0.6)',
      'rgba(255, 250, 205, 0.7)',
      'rgba(240, 248, 255, 0.5)'
    ];

    const createStarLayers = (layerCount, starsPerLayer) => {
      const layers = [];
      for (let l = 0; l < layerCount; l++) {
        const stars = [];
        for (let i = 0; i < starsPerLayer; i++) {
          stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2.5 * (l + 1) / layerCount,
            vx: (Math.random() * 0.1 - 0.05) * (l + 1) / layerCount,
            vy: (Math.random() * 0.1 - 0.05) * (l + 1) / layerCount,
            type: starTypes[Math.floor(Math.random() * starTypes.length)],
            color: starColors[Math.floor(Math.random() * starColors.length)]
          });
        }
        layers.push(stars);
      }
      return layers;
    };

    const drawStars = (stars, speedMultiplier) => {
      stars.forEach((star) => {
        ctx.fillStyle = star.color;
        star.type.draw(ctx, star.x, star.y, star.radius, star.color);

        star.x += star.vx * speedMultiplier;
        star.y += star.vy * speedMultiplier;

        star.x = (star.x + canvas.width) % canvas.width;
        star.y = (star.y + canvas.height) % canvas.height;
      });
    };

    const animate = (starLayers) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      starLayers.forEach((layer, index) => {
        drawStars(layer, (index + 1) / starLayers.length);
      });
      animationFrameId = requestAnimationFrame(() => animate(starLayers));
    };

    resizeCanvas();
    const starLayers = createStarLayers(3, 30);
    animate(starLayers);

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

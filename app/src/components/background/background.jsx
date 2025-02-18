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
  let mouseX = 0, mouseY = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const starColors = [
      'rgba(255, 255, 255, 0.8)',
      'rgba(255, 255, 200, 0.7)',
      'rgba(230, 230, 250, 0.6)',
      'rgba(255, 250, 205, 0.7)',
      'rgba(240, 248, 255, 0.5)'
    ];

    const createStars = (count) => {
      const stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2.5,
          vx: Math.random() * 0.05 - 0.025,
          vy: Math.random() * 0.05 - 0.025,
          depth: Math.random() * 1.5 + 0.5, // Slower parallax effect
          color: starColors[Math.floor(Math.random() * starColors.length)]
        });
      }
      return stars;
    };

    const drawStars = (stars) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        star.x += star.vx + (mouseX / 150) * star.depth;
        star.y += star.vy + (mouseY / 150) * star.depth;

        // Wrap around screen edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
      });
    };

    const animate = (stars) => {
      drawStars(stars);
      animationFrameId = requestAnimationFrame(() => animate(stars));
    };

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) / 20;
      mouseY = (e.clientY - window.innerHeight / 2) / 20;
    };

    resizeCanvas();
    const stars = createStars(70);
    animate(stars);

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
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

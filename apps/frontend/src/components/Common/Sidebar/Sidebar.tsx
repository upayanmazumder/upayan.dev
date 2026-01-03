'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Trigger from './Trigger';
import Panel from './Panel';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveringEdge, setHoveringEdge] = useState(false);
  const [showOnScrollTop, setShowOnScrollTop] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const isNearRight = e.clientX > window.innerWidth * 0.92;
      setHoveringEdge(isNearRight);
    };

    const handleScroll = () => {
      const current = window.scrollY;
      const atTop = current === 0;

      if (atTop) {
        setShowOnScrollTop(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setShowOnScrollTop(false);
          timeoutRef.current = null;
        }, 3000);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setShowOnScrollTop(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const shouldShowTrigger = hoveringEdge || isOpen || showOnScrollTop;

  return (
    <>
      <Trigger
        shouldShow={shouldShowTrigger}
        onOpen={() => setIsOpen(true)}
        ref={sidebarRef}
      />

      <AnimatePresence>
        {isOpen && <Panel onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

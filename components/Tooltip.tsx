"use client";

import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  className?: string;
}

export default function Tooltip({ children, text, className = "" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setPosition({
        left: rect.left + rect.width / 2,
        top: rect.top
      });
    }
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
    updatePosition();
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      const handleScroll = () => updatePosition();
      const handleResize = () => updatePosition();
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isVisible]);

  const tooltipContent = isVisible && typeof window !== 'undefined' ? (
    createPortal(
      <div
        className="fixed z-[99999] px-3 py-2 text-xs text-white bg-gray-800 rounded-lg pointer-events-none shadow-xl whitespace-normal break-words"
        style={{
          left: `${position.left}px`,
          top: `${position.top}px`,
          transform: 'translate(-50%, calc(-100% - 8px))',
          maxWidth: '250px',
          width: 'max-content',
          minWidth: '100px'
        }}
      >
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
      </div>,
      document.body
    )
  ) : null;

  return (
    <>
      <div 
        ref={wrapperRef}
        className={`group relative inline-block ${className}`} 
        style={{ overflow: 'visible' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {tooltipContent}
    </>
  );
}


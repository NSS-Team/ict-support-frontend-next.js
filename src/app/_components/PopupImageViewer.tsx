'use client';

import { X, ZoomIn, ZoomOut, RefreshCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface PopupImageViewerProps {
  imageUrl: string;
  onClose: () => void;
}

const PopupImageViewer = ({ imageUrl, onClose }: PopupImageViewerProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Zoom in/out on scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScale((prev) => Math.max(1, Math.min(prev + (e.deltaY < 0 ? 0.2 : -0.2), 5)));
    };

    const container = containerRef.current;
    if (container) container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container?.removeEventListener('wheel', handleWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    setScale((prev) => (prev === 1 ? 2 : 1));
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 5));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 1));
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
  <div className="fixed inset-0 z-50 bg-opacity-50 backdrop-blur-sm flex flex-col items-center justify-center px-4">
    {/* Overlay background that closes on click */}
    <div className="absolute inset-0" onClick={onClose} />

    {/* Control Bar (above image) */}
    <div className="z-50 flex items-center gap-4 mb-4 bg-black bg-opacity-80 rounded-xl px-4 py-2 shadow-md backdrop-blur-md">
      <button
        onClick={zoomIn}
        className="text-white hover:text-blue-600 transition"
        title="Zoom In"
      >
        <ZoomIn size={20} />
      </button>
      <button
        onClick={zoomOut}
        className="text-white hover:text-blue-600 transition"
        title="Zoom Out"
      >
        <ZoomOut size={20} />
      </button>
      <button
        onClick={resetZoom}
        className="text-white hover:text-blue-600 transition"
        title="Reset Zoom"
      >
        <RefreshCcw size={20} />
      </button>
      <button
        onClick={onClose}
        className="ml-4 text-red-600 hover:text-red-800 transition"
        title="Close"
      >
        <X size={20} />
      </button>
    </div>

    {/* Image Container */}
    <div
      ref={containerRef}
      className="relative max-w-6xl w-full max-h-[90vh] flex justify-center items-center"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Popup"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        style={{
          transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          cursor: scale > 1 ? 'grab' : 'default',
          transition: isDragging ? 'none' : 'transform 0.2s ease-in-out',
        }}
        className="max-h-[90vh] w-auto rounded-lg shadow-lg z-40 select-none"
        draggable={false}
      />
    </div>
  </div>
);

};

export default PopupImageViewer;

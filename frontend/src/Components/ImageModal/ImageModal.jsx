import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineZoomIn, AiOutlineZoomOut, AiOutlineReload } from "react-icons/ai";

const ImageModal = ({ isOpen, onClose, src, title, subtitle }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // Reset zoom when modal opens
    if (isOpen) {
      setScale(1);
    }
  }, [isOpen, src]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setScale((prev) => Math.min(prev + 0.3, 3));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setScale((prev) => Math.max(prev - 0.3, 0.6));
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setScale(1);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between items-center p-4 select-none animate-fade-in"
    >
      {/* Top Header */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl flex justify-between items-center text-white py-2 px-4 z-10"
      >
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-[#e9edef] truncate">
            {title || "Profile Picture"}
          </h3>
          {subtitle && (
            <p className="text-xs text-[#8696a0]">{subtitle}</p>
          )}
        </div>

        {/* Zoom Controls & Close Button */}
        <div className="flex items-center space-x-2 bg-[#202c33]/80 rounded-full px-3 py-1.5 border border-white/10">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 text-[#aebac1] hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <AiOutlineZoomIn className="text-lg" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 text-[#aebac1] hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <AiOutlineZoomOut className="text-lg" />
          </button>
          <button
            onClick={handleReset}
            title="Reset Zoom"
            className="p-1.5 text-[#aebac1] hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <AiOutlineReload className="text-sm" />
          </button>
          <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
          <button
            onClick={onClose}
            title="Close"
            className="p-1.5 text-[#aebac1] hover:text-red-400 hover:bg-white/10 rounded-full transition-colors"
          >
            <AiOutlineClose className="text-lg font-bold" />
          </button>
        </div>
      </div>

      {/* Main Image Display with Zoom scale */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex-1 w-full flex items-center justify-center overflow-hidden p-4 cursor-default"
      >
        <img
          src={src}
          alt={title || "Profile Zoom"}
          style={{
            transform: `scale(${scale})`,
            transition: "transform 0.15s ease-out",
          }}
          className="max-h-[80vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl ring-2 ring-white/10"
        />
      </div>

      {/* Bottom Hint */}
      <div className="text-xs text-[#8696a0] pb-2">
        Click anywhere outside or press ESC to close
      </div>
    </div>
  );
};

export default ImageModal;

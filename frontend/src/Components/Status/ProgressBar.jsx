import React, { useEffect, useState } from "react";

const ProgressBar = ({ index, activeIndex, duration, isPaused }) => {
  const isPast = index < activeIndex;
  const isCurrent = index === activeIndex;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isCurrent) {
      setProgress(isPast ? 100 : 0);
      return;
    }

    setProgress(0);
    const intervalTime = 50;
    const step = 100 / (duration / intervalTime);

    const intervalId = setInterval(() => {
      if (isPaused) return;

      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalId);
          return 100;
        }
        return Math.min(prev + step, 100);
      });
    }, intervalTime);

    return () => clearInterval(intervalId);
  }, [activeIndex, isCurrent, isPast, duration, isPaused]);

  return (
    <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden mx-1 backdrop-blur-xs">
      <div
        className="h-full bg-white rounded-full transition-all duration-75 ease-linear"
        style={{
          width: isPast ? "100%" : isCurrent ? `${progress}%` : "0%",
        }}
      />
    </div>
  );
};

export default ProgressBar;

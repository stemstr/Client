import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import useResizeObserver from "@react-hook/resize-observer";
import { constrain } from "utils/common";

export default function WaveForm({
  data,
  currentTime,
  scrubTime,
  setScrubTime,
  audioRef,
  play,
  pause,
  duration,
}) {
  const scrubProgress = useMemo(() => {
    return duration && scrubTime !== null ? scrubTime / duration : null;
  }, [scrubTime, duration]);
  const playProgress = useMemo(() => {
    return duration ? currentTime / duration : 0;
  }, [currentTime, duration]);
  const [currentData, setCurrentData] = useState(data);
  const [emptyBars, setEmptyBars] = useState([]);
  const [progressBars, setProgressBars] = useState([]);
  const [scrubBars, setScrubBars] = useState(null);
  const containerRef = useRef(null);
  const [width, setWidth] = useState(300);

  useResizeObserver(containerRef, (entry) => {
    setWidth(entry.contentRect.width);
  });

  useEffect(() => {
    if (data) {
      setCurrentData(data);
    } else {
      setCurrentData(generateWaveFormData(64));
    }
  }, [data, setCurrentData]);

  const getBars = (from, to, color) => {
    const lowerBound = Math.min(from, to) * currentData.length;
    const upperBound = Math.max(from, to) * currentData.length;

    const height = 64;
    const spacing = 3; // Adjust the spacing between bars here
    const maxValue = 64;

    // Calculate bar width to collectively take up the full width of the SVG
    const barWidth =
      (width - (currentData.length - 1) * spacing) / currentData.length;

    const bars = currentData.map((n, index) => {
      const x = index * (barWidth + spacing);
      const barHeight = (n / maxValue) * height;
      const yOffset = (height - barHeight) / 2;
      const y = yOffset;

      let fillColor = color;
      let emptyColor = "transparent";

      let progressInBar;
      if (index < Math.floor(lowerBound)) {
        progressInBar = 0;
      } else if (index < Math.ceil(lowerBound)) {
        fillColor = "transparent";
        emptyColor = color;
        progressInBar = lowerBound - index;
      } else if (index < Math.floor(upperBound)) {
        progressInBar = 1;
      } else if (index < Math.ceil(upperBound)) {
        progressInBar = upperBound - index;
      } else {
        progressInBar = 0;
      }

      // Filled part
      const filledWidth = barWidth * progressInBar;

      // Empty part
      const emptyWidth = barWidth * (1 - progressInBar);

      return {
        x,
        y,
        filledWidth,
        emptyWidth,
        barHeight,
        fillColor,
        emptyColor,
      };
    });

    return bars;
  };

  useEffect(() => {
    if (!currentData) {
      return;
    }

    const emptyBars = getBars(0, 1, "#3B2D5E");
    const progressBars = getBars(0, playProgress, "#865AE2");
    const scrubBars = scrubProgress
      ? getBars(playProgress, scrubProgress, "#513C86")
      : null;

    setEmptyBars(emptyBars);
    setProgressBars(progressBars);
    setScrubBars(scrubBars);
  }, [
    currentData,
    scrubProgress,
    playProgress,
    width,
    setEmptyBars,
    setProgressBars,
    setScrubBars,
  ]);

  const handleTouchMove = (event) => {
    const rect = containerRef.current.getBoundingClientRect();
    const { touches } = event;
    const touchX = touches[0].clientX - rect.left; // X-coordinate of the touch
    const totalWidth = containerRef.current.offsetWidth;
    const newScrubTime = constrain(
      (touchX / totalWidth) * duration,
      0,
      duration
    );
    setScrubTime(newScrubTime);
    pause();
  };

  const handleTouchEnd = () => {
    if (scrubTime) {
      audioRef.current.currentTime = scrubTime;
      play();
    }
    setScrubTime(null);
  };

  const handleMouseMove = (event) => {
    if (duration) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const totalWidth = containerRef.current.offsetWidth;
      const newScrubTime = constrain(
        (mouseX / totalWidth) * duration,
        0,
        duration
      );
      setScrubTime(newScrubTime);
    }
  };

  const handleMouseLeave = () => {
    setScrubTime(null);
  };

  const handleClick = () => {
    if (scrubTime) {
      audioRef.current.currentTime = scrubTime;
      play();
    }
    setScrubTime(null);
  };
  const isAnimating = !data;
  const Rect = isAnimating ? motion.rect : rect;

  return (
    <div
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      ref={containerRef}
      style={{
        flexGrow: 1,
        height: 64,
        minWidth: 0,
        position: "relative",
        cursor: "pointer",
      }}
    >
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        viewBox={`0 0 ${width} 64`}
        preserveAspectRatio="none"
      >
        {[emptyBars, progressBars, scrubBars].map(
          (bars, barsIndex) =>
            bars &&
            bars.map((bar, barIndex) => (
              <g key={`${barsIndex}-${barIndex}`}>
                {/* Filled part of bar */}
                <Rect
                  initial={{ scaleY: 1 }}
                  // Upload animation
                  animate={
                    !data && barsIndex === 0
                      ? {
                          scaleY: [1, 0.5, 1],
                          transition: {
                            duration: 0.5 + barIndex * 0.05,
                            repeat: Infinity,
                            repeatType: "loop",
                          },
                        }
                      : undefined
                  }
                  x={bar.x}
                  y={bar.y}
                  width={bar.filledWidth}
                  height={bar.barHeight}
                  fill={bar.fillColor}
                />
                {/* Empty part of bar */}
                <Rect
                  initial={{ scaleY: 1 }}
                  x={bar.x + bar.filledWidth}
                  y={bar.y}
                  width={bar.emptyWidth}
                  height={bar.barHeight}
                  fill={bar.emptyColor}
                />
              </g>
            ))
        )}
      </svg>
    </div>
  );
}

const rect = ({ children, ...rest }) => {
  return <rect {...rest}>{children}</rect>;
};

export function generateWaveFormData(n) {
  let result = [];
  let min = 16;
  let max = 64;

  for (let i = 0; i < n; i++) {
    let number = ((Math.sin((i / n) * 16) + 1) / 2) * (max - min) + min;
    result[i] = number;
  }

  return result;
}

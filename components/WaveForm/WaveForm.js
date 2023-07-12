import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import useResizeObserver from "@react-hook/resize-observer";
import { constrain } from "utils/common";

export default function WaveForm({ data, currentTime, duration }) {
  const [scrubTime, setScrubTime] = useState(null);
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

    const emptyBars = getBars(0, 1, "rgba(134, 90, 226, 0.48)");
    const progressBars = getBars(0, playProgress, "#9747FF");
    const scrubBars = scrubProgress
      ? getBars(playProgress, scrubProgress, "#865AE2")
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

  const handleMouseMove = (event) => {
    if (duration) {
      const mouseX = event.clientX - containerRef.current.offsetLeft;
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

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
          (bars) =>
            bars &&
            bars.map((bar, index) => (
              <g key={index}>
                <motion.rect
                  initial={{ scaleY: 1 }}
                  x={bar.x}
                  y={bar.y}
                  width={bar.filledWidth}
                  height={bar.barHeight}
                  fill={bar.fillColor}
                />
                <motion.rect
                  initial={{ scaleY: 1 }}
                  animate={
                    !data
                      ? {
                          scaleY: [1, 0.5, 1],
                          transition: {
                            duration: 0.5 + index * 0.05,
                            repeat: Infinity,
                            repeatType: "loop",
                          },
                        }
                      : undefined
                  }
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

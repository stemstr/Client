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
  const [bars, setBars] = useState([]);
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

  useEffect(() => {
    if (!currentData) {
      return;
    }

    const height = 64;
    const spacing = 3; // Adjust the spacing between bars here
    const maxValue = 64;

    // Calculate bar width to collectively take up the full width of the SVG
    const barWidth =
      (width - (currentData.length - 1) * spacing) / currentData.length;

    const progressIndex = playProgress * currentData.length;

    const newBars = currentData.map((n, index) => {
      const x = index * (barWidth + spacing);
      const barHeight = (n / maxValue) * height;
      const yOffset = (height - barHeight) / 2;
      const y = yOffset;

      const progressInBar = Math.max(0, Math.min(1, progressIndex - index));

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
        fillColor: "#9747FF",
        emptyColor: "rgba(134, 90, 226, 0.48)",
      };
    });

    setBars(newBars);
  }, [currentData, scrubProgress, playProgress, width, setBars]);

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
        {bars.map((bar, index) => (
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
        ))}
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

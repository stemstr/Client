import { Box, Group } from "@mantine/core";
import React, { useRef, useEffect } from "react";

export default function WaveForm({ data, playProgress = 0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const spacing = 3; // Adjust the spacing between bars here
    const maxValue = 64;
    const barWidth = (width - (data.length - 1) * spacing) / data.length;

    const progressIndex = playProgress * data.length;

    data.forEach((n, index) => {
      const x = index * (barWidth + spacing);
      const barHeight = (n / maxValue) * height;
      const yOffset = (height - barHeight) / 2;
      const y = yOffset;

      const progressInBar = Math.max(0, Math.min(1, progressIndex - index));

      // Filled part
      ctx.fillStyle = "#9747FF";
      ctx.fillRect(x, y, barWidth * progressInBar, barHeight);

      // Empty part
      ctx.fillStyle = "rgba(134, 90, 226, 0.48)";
      ctx.fillRect(
        x + barWidth * progressInBar,
        y,
        barWidth * (1 - progressInBar),
        barHeight
      );
    });
  }, [data, playProgress]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        flexGrow: 1,
        height: 64,
      }}
    />
  );
}

function generateWaveFormData(n) {
  let result = [];
  let min = 16;
  let max = 64;

  for (let i = 0; i < n; i++) {
    let number = ((Math.sin((i / n) * 16) + 1) / 2) * (max - min) + min;
    result[i] = number;
  }

  return result;
}

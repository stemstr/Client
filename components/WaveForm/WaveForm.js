import { Box, Group } from "@mantine/core";
import { useEffect, useRef } from "react";

export default function WaveForm({ data, playProgress = 0 }) {
  const waveFormData = useRef(null);

  useEffect(() => {
    if (data) waveFormData.current = generateWaveFormData(64);
  }, [data]);

  return (
    <Group
      grow
      spacing={4}
      sx={(theme) => ({
        height: 64,
        flexGrow: "1!important",
      })}
    >
      {waveFormData.current?.map((n, index) => (
        <Box
          key={index}
          sx={(theme) => ({
            height: n,
            backgroundColor:
              playProgress > index / waveFormData.current.length
                ? "#9747FF"
                : "rgba(134, 90, 226, 0.48)",
            borderRadius: theme.radius.xl,
          })}
        ></Box>
      ))}
    </Group>
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

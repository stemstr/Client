import { Box, Group } from "@mantine/core";
import { useEffect, useRef } from "react";

export default function WaveForm({ audioFile }) {
  const waveFormData = useRef(null);

  useEffect(() => {
    waveFormData.current = generateRandomWaveFormData(64);
  }, [audioFile]);

  return (
    <Group
      grow
      spacing={4}
      sx={(theme) => ({
        height: 64,
        flexGrow: 1,
      })}
    >
      {waveFormData.current?.map((n, index) => (
        <Box
          key={index}
          sx={(theme) => ({
            height: n,
            backgroundColor: theme.colors.dark[2],
            borderRadius: theme.radius.xl,
          })}
        ></Box>
      ))}
    </Group>
  );
}

function generateRandomWaveFormData(n) {
  let result = [];
  let min = 6;
  let max = 64;
  let prevNumber = null;

  for (let i = 0; i < n; i++) {
    let randomNumber = Math.floor(Math.random() * (max - min + 1) + min);

    if (prevNumber !== null && Math.abs(randomNumber - prevNumber) > 16) {
      i--;
      continue;
    }

    result.push(randomNumber);
    prevNumber = randomNumber;
  }

  return result;
}

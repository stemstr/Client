import { Box, Group } from "@mantine/core";

export default function WaveForm({ data, playProgress = 0 }) {
  return (
    <Group
      grow
      spacing={4}
      sx={(theme) => ({
        height: 64,
        flexGrow: "1!important",
      })}
    >
      {data?.map((n, index) => (
        <Box
          key={index}
          sx={(theme) => ({
            height: n,
            backgroundColor:
              playProgress > index / data.length
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

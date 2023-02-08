import { Box, Group, Text } from '@mantine/core';

export default function GlobalFeedHeader() {
  return (
    <Box
      component={Group}
      position="apart"
      sx={(theme) => ({
        // paddingBottom: theme.spacing.md,
      })}
    >
      <Text
        sx={(theme) => ({
          color: theme.white,
          fontWeight: 700,
          fontSize: 24,
        })}
      >
        Stemstr
      </Text>
      <Text>🔔</Text>
    </Box>
  );
}

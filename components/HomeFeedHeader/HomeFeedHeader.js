import { Box, Group, Text } from "@mantine/core";
import { BellIcon, SearchIcon } from "../../icons/StemstrIcon";

export default function HomeFeedHeader() {
  return (
    <Box
      component={Group}
      position="apart"
      sx={(theme) => ({
        marginBottom: theme.spacing.md,
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
      <Group spacing={48}>
        <SearchIcon />
        <BellIcon />
      </Group>
    </Box>
  );
}

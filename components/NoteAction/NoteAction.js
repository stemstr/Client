import { Avatar, Box, Group, Stack, Text } from "@mantine/core";

export default function NoteAction({ children }) {
  return (
    <Box
      sx={{
        padding: "6px 12px",
      }}
    >
      <Text size="sm">{children}</Text>
    </Box>
  );
}

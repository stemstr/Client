import { Avatar, Box, Group, Stack, Text } from "@mantine/core";

export default function NoteAction({ children, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={(theme) => ({
        padding: "6px 12px",
        display: "flex",
        alignItems: "center",
        fontSize: theme.fontSizes.sm,
        cursor: "pointer",
      })}
    >
      {children}
    </Box>
  );
}

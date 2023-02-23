import { Group, Stack, Text } from "@mantine/core";

export default function FieldGroup({ TitleIcon, title, children }) {
  return (
    <Stack
      spacing="sm"
      sx={(theme) => ({
        color: theme.white,
      })}
    >
      <Group spacing="xs" align="center">
        {TitleIcon && <TitleIcon width={20} height={20} />}{" "}
        <Text fw={500} sx={{ lineHeight: "normal" }}>
          {title}
        </Text>
      </Group>
      {children}
    </Stack>
  );
}

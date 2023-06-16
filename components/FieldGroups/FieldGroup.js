import { Group, Stack, Text } from "@mantine/core";

export default function FieldGroup({
  TitleIcon,
  title,
  children,
  titleFontSize,
  iconSize,
}) {
  return (
    <Stack
      spacing="sm"
      sx={(theme) => ({
        color: theme.white,
      })}
    >
      <Group spacing={iconSize ? iconSize / 2 : "xs"} align="center">
        {TitleIcon && (
          <TitleIcon width={iconSize || 20} height={iconSize || 20} />
        )}{" "}
        <Text
          fw={500}
          fz={titleFontSize || undefined}
          sx={{ lineHeight: "normal" }}
        >
          {title}
        </Text>
      </Group>
      {children}
    </Stack>
  );
}

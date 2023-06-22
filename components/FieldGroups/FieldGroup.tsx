import { Group, Stack, Text } from "@mantine/core";
import { type PropsWithChildren, type FC } from "react";

interface FieldGroupProps {
  TitleIcon?: FC<{ width: number; height: number }>;
  title: string;
  titleFontSize?: number;
  iconSize?: number;
  disabled?: boolean;
}

export default function FieldGroup({
  TitleIcon,
  title,
  children,
  titleFontSize,
  iconSize,
  disabled,
}: PropsWithChildren<FieldGroupProps>) {
  return (
    <Stack
      spacing="xs"
      sx={(theme) => ({
        color: theme.white,
        opacity: disabled ? 0.2 : 1,
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

import { Anchor, Box, Group, Stack, Text } from "@mantine/core";
import { MouseEventHandler } from "react";
import useStyles from "components/Settings/Settings.styles";
import { ChevronRightIcon } from "icons/StemstrIcon";
import Link from "next/link";

export type SettingsItemProps = {
  Icon: (props: any) => JSX.Element;
  title: string;
  description: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  extra?: JSX.Element;
};

export default function SettingsItem({
  Icon,
  title,
  description,
  href,
  onClick,
  extra,
}: SettingsItemProps) {
  const { classes } = useStyles();

  const settingsItem = (
    <Box
      onClick={onClick}
      className={classes.settingsItem}
      sx={{ cursor: onClick || href ? "pointer" : undefined }}
    >
      <Group pl={4} pr={4} spacing={24} noWrap>
        <Box sx={{ flexShrink: 0 }}>
          <Icon width={16} height={16} color="white" />
        </Box>
        <Stack spacing={8} sx={{ flexGrow: 1 }}>
          <Text fz="sm" fw={500} c="white">
            {title}
          </Text>
          <Text fz="xs" c="gray.1" sx={{ overflowWrap: "anywhere" }}>
            {description}
          </Text>
        </Stack>
        {extra}
        {href && <ChevronRightIcon width={16} height={16} color="white" />}
      </Group>
    </Box>
  );

  if (href) {
    return (
      <Anchor
        component={Link}
        href={href}
        sx={{ width: "100%", ":hover": { textDecoration: "none" } }}
      >
        {settingsItem}
      </Anchor>
    );
  }

  return settingsItem;
}

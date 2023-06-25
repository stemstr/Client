import { Route } from "enums";
import { Box, Group, Stack, Text } from "@mantine/core";
import { MouseEventHandler } from "react";
import useStyles from "components/Settings/Settings.styles";

export type SettingsItemProps = {
  Icon: (props: any) => JSX.Element;
  title: string;
  description: string;
  route?: Route;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export default function SettingsItem({
  Icon,
  title,
  description,
  route,
  onClick,
}: SettingsItemProps) {
  const { classes } = useStyles();

  return (
    <Box
      onClick={onClick}
      className={classes.settingsItem}
      sx={{ cursor: onClick || route ? "pointer" : undefined }}
    >
      <Group pl={4} pr={4} spacing={24} noWrap>
        <Box sx={{ flexShrink: 0 }}>
          <Icon width={16} height={16} color="white" />
        </Box>
        <Stack spacing={8}>
          <Text fz="sm" fw={500} c="white">
            {title}
          </Text>
          <Text fz="xs">{description}</Text>
        </Stack>
      </Group>
    </Box>
  );
}

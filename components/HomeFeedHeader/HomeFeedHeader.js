import { Box, Group, Text } from "@mantine/core";
import { SearchIcon } from "../../icons/StemstrIcon";
import ProfileLink from "../ProfileLink/ProfileLink";

export default function HomeFeedHeader() {
  return (
    <Box
      component={Group}
      position="apart"
      sx={(theme) => ({
        backgroundColor: theme.colors.dark[7],
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.md,
        [theme.fn.largerThan("xs")]: {
          position: "sticky",
          top: 0,
          zIndex: 1,
        },
      })}
    >
      <Text
        sx={(theme) => ({
          color: theme.white,
          fontWeight: 700,
          fontSize: 24,
        })}
        lh="normal"
      >
        Stemstr
      </Text>
      <Group spacing={20}>
        <ProfileLink />
      </Group>
    </Box>
  );
}

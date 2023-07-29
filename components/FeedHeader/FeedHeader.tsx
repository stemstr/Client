import { Box, Group, Text } from "@mantine/core";
import { PropsWithChildren } from "react";
import { MaxWidthContainer } from "../Feed";
import ProfileMenu from "components/ProfileMenu/ProfileMenu";

export default function FeedHeader({ children }: PropsWithChildren) {
  return (
    <MaxWidthContainer>
      <Group
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
          {children}
        </Text>
        <ProfileMenu />
      </Group>
    </MaxWidthContainer>
  );
}

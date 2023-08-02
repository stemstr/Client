import { Group, Text } from "@mantine/core";
import { PropsWithChildren } from "react";
import { MaxWidthContainer } from "../Feed";
import ProfileMenu from "components/ProfileMenu/ProfileMenu";
import { useRouter } from "next/router";

export default function FeedHeader({ children }: PropsWithChildren) {
  const router = useRouter();

  return (
    <MaxWidthContainer>
      <Group
        position="apart"
        noWrap
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
          onClick={() => router.reload()}
          lh="normal"
          truncate
          sx={(theme) => ({
            color: theme.white,
            fontWeight: 700,
            fontSize: 24,
            cursor: "pointer",
          })}
        >
          {children}
        </Text>
        <ProfileMenu />
      </Group>
    </MaxWidthContainer>
  );
}

import { Group, Text } from "@mantine/core";
import { PropsWithChildren } from "react";
import { MaxWidthContainer } from "../Feed";
import ProfileMenu from "components/ProfileMenu/ProfileMenu";
import { useRouter } from "next/router";
import SearchButton from "components/Search/SearchButton";

export default function FeedHeader({ children }: PropsWithChildren) {
  const router = useRouter();

  return (
    <MaxWidthContainer sx={{ position: "sticky", top: 0, zIndex: 1 }}>
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
        <Group>
          <SearchButton />
          <ProfileMenu />
        </Group>
      </Group>
    </MaxWidthContainer>
  );
}

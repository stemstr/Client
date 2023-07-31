import { Box, Group, Text } from "@mantine/core";
import { PropsWithChildren } from "react";
import { MaxWidthContainer } from "../Feed";
import ProfileMenu from "components/ProfileMenu/ProfileMenu";

type FeedHeaderProps = PropsWithChildren & {
  onClickTitle?: () => void;
};

export default function FeedHeader({
  onClickTitle,
  children,
}: FeedHeaderProps) {
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
          onClick={onClickTitle}
          sx={(theme) => ({
            color: theme.white,
            fontWeight: 700,
            fontSize: 24,
            cursor: onClickTitle && "pointer",
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

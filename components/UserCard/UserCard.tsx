import { Button, Text, useMantineTheme } from "@mantine/core";
import { Avatar, Group, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import FollowButton from "components/FollowButton/FollowButton";
import useStyles from "components/UserCard/UserCard.styles";
import { VerifiedIcon } from "icons/StemstrIcon";
import useNip05 from "ndk/hooks/useNip05";
import { useUser } from "ndk/hooks/useUser";
import { Nip05Status } from "store/Nip05";

export default function UserCard({ pubkey }: { pubkey: string }) {
  const user = useUser(pubkey);

  return (
    <Group
      p="md"
      noWrap
      sx={(theme) => ({
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: theme.colors.gray[4],
        borderRadius: 12,
      })}
    >
      <Avatar
        src={user?.profile?.image}
        alt={user?.profile?.name}
        size={42}
        radius={21}
      />
      <Stack spacing={6} sx={{ overflow: "hidden", flex: 1 }}>
        <UserCardTitle pubkey={pubkey} />
        <UserCardContent pubkey={pubkey} />
      </Stack>
      <UserCardFollowButton pubkey={pubkey} />
    </Group>
  );
}

const UserCardTitle = ({ pubkey }: { pubkey: string }) => {
  const user = useUser(pubkey);
  const nip05Status = useNip05(user?.hexpubkey(), user?.profile?.nip05);

  return (
    <Group spacing={6} w="100%" noWrap>
      <Text color="white" fz="lg">
        {user?.profile?.displayName
          ? user?.profile.displayName
          : `@${user?.hexpubkey().substring(0, 5)}...`}
      </Text>
      {nip05Status === Nip05Status.Valid && (
        <VerifiedIcon width={14} height={14} />
      )}
      <Text fz="xs">@{user?.profile?.name}</Text>
    </Group>
  );
};
const UserCardContent = ({ pubkey }: { pubkey: string }) => {
  const user = useUser(pubkey);
  return (
    <Text fz="xs" truncate>
      {user?.profile?.about}
    </Text>
  );
};

const UserCardFollowButton = ({ pubkey }: { pubkey: string }) => {
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.xs}px`);
  const { classes, cx } = useStyles();

  return (
    <FollowButton pubkey={pubkey}>
      {({ isFollowing, enabled, handleClick, Icon }) => {
        return (
          <Button
            pl={16}
            pr={16}
            onClick={handleClick}
            className={cx(classes.followButton, {
              [classes.followButtonDisabled]: !enabled,
              [classes.unfollowButton]: isFollowing,
            })}
          >
            <Icon width={16} height={16} />
            {enabled && isDesktop && (
              <Text lh="normal" ml={8}>
                {isFollowing ? "Following" : "Follow"}
              </Text>
            )}
          </Button>
        );
      }}
    </FollowButton>
  );
};

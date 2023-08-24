import {
  Box,
  Button,
  DefaultProps,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Avatar, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import FollowButton from "components/FollowButton/FollowButton";
import useStyles from "components/UserCard/UserCard.styles";
import { Route } from "enums";
import { VerifiedIcon } from "icons/StemstrIcon";
import useNip05 from "ndk/hooks/useNip05";
import useProfilePicSrc from "ndk/hooks/useProfilePicSrc";
import { useUser } from "ndk/hooks/useUser";
import { getNormalizedName, getNormalizedUsername } from "ndk/utils";
import { useRouter } from "next/router";
import { Nip05Status } from "store/Nip05";
import withStopClickPropagation from "utils/hoc/withStopClickPropagation";

interface UserCardProps extends DefaultProps {
  pubkey: string;
  showFollowButton?: boolean;
}

export default function UserCard({
  pubkey,
  showFollowButton = true,
  ...rest
}: UserCardProps) {
  const router = useRouter();
  const user = useUser(pubkey);
  const profilePicSrc = useProfilePicSrc(user);

  return (
    <Box onClick={() => router.push(`${Route.User}/${user?.npub}`)} {...rest}>
      <Group
        p="md"
        h={92}
        noWrap
        sx={(theme) => ({
          cursor: "pointer",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: theme.colors.gray[4],
          borderRadius: 12,
          transition: "border-color .3s ease",
          "&:hover": {
            borderColor: theme.colors.purple[5],
          },
        })}
      >
        <Avatar
          src={profilePicSrc}
          alt={user?.profile?.name}
          size={42}
          radius={21}
        />
        <Box sx={{ overflow: "hidden", flex: 1 }}>
          <UserCardTitle pubkey={pubkey} />
          <UserCardContent pubkey={pubkey} />
        </Box>
        {showFollowButton && <UserCardFollowButton pubkey={pubkey} />}
      </Group>
    </Box>
  );
}

const UserCardTitle = ({ pubkey }: { pubkey: string }) => {
  const user = useUser(pubkey);
  const nip05Status = useNip05(user?.hexpubkey(), user?.profile?.nip05);

  return (
    <>
      <Group spacing={6} w="100%" noWrap>
        <Text color="white" fz="lg" truncate>
          {getNormalizedName(user?.hexpubkey() ?? "", user)}
        </Text>
        {nip05Status === Nip05Status.Valid && (
          <VerifiedIcon width={14} height={14} />
        )}
      </Group>
      <Text mb={6} fz="xs">
        {getNormalizedUsername(user)}
      </Text>
    </>
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

const UserCardFollowButton = withStopClickPropagation<any>(
  ({ pubkey }: { pubkey: string }) => {
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
                [classes.unfollowButton]: isFollowing,
              })}
              disabled={!enabled}
            >
              <Icon color="white" width={16} height={16} />
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
  }
);

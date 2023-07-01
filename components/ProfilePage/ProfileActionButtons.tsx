import { Group, Text } from "@mantine/core";
import FollowButton from "components/FollowButton/FollowButton";
import ProfileActionButton from "components/ProfileActionButton/ProfileActionButton";
import useStyles from "components/ProfilePage/ProfilePage.styles";
import { Route } from "enums";
import { EditIcon, ShareIcon, ZapIcon } from "icons/StemstrIcon";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "store/Auth";

type ProfileActionButtonsProps = {
  pubkey: string;
};

export default function ProfileActionButtons({
  pubkey,
}: ProfileActionButtonsProps) {
  const router = useRouter();
  const { classes } = useStyles();
  const authState = useSelector(selectAuthState);
  const isCurrentUser = useMemo(
    () => pubkey === authState.pk,
    [pubkey, authState.pk]
  );

  return (
    <Group spacing={12} className={classes.profileActionButtons}>
      <ProfileActionButton>
        <ShareIcon width={16} height={16} />
      </ProfileActionButton>
      <ProfileActionButton>
        <ZapIcon width={16} height={16} />
      </ProfileActionButton>
      {isCurrentUser && (
        <ProfileActionButton onClick={() => router.push(Route.EditProfile)}>
          <EditIcon width={16} height={16} />
          <Text lh="normal" ml={8}>
            Edit Profile
          </Text>
        </ProfileActionButton>
      )}
      {!isCurrentUser && <ProfileActionFollowButton pubkey={pubkey} />}
    </Group>
  );
}

const ProfileActionFollowButton = ({ pubkey }: { pubkey: string }) => {
  const { classes, cx } = useStyles();

  return (
    <FollowButton pubkey={pubkey}>
      {({ isFollowing, enabled, handleClick, Icon }) => {
        return (
          <ProfileActionButton
            onClick={handleClick}
            className={cx(classes.followButton, {
              [classes.followButtonDisabled]: !enabled,
              [classes.unfollowButton]: isFollowing,
            })}
            sx={{ minWidth: 101.41 }}
          >
            <Icon width={16} height={16} />
            {enabled && (
              <Text lh="normal" ml={8}>
                {isFollowing ? "Following" : "Follow"}
              </Text>
            )}
          </ProfileActionButton>
        );
      }}
    </FollowButton>
  );
};

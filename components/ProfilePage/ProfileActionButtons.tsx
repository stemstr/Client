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
      {!isCurrentUser && <FollowButton pubkey={pubkey} />}
    </Group>
  );
}

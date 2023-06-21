import { Text } from "@mantine/core";
import useStyles from "components/FollowButton/FollowButton.styles";
import ProfileActionButton from "components/ProfileActionButton/ProfileActionButton";
import { FollowIcon } from "icons/StemstrIcon";

type FollowButtonProps = {
  pubkey: string;
};

export default function FollowButton({ pubkey }: FollowButtonProps) {
  const { classes, cx } = useStyles();

  return (
    <ProfileActionButton className={cx(classes.button)}>
      <FollowIcon width={16} height={16} />
      <Text lh="normal" ml={8}>
        Follow
      </Text>
    </ProfileActionButton>
  );
}

import { Text } from "@mantine/core";
import { NDKEvent, NDKTag } from "@nostr-dev-kit/ndk";
import useStyles from "components/FollowButton/FollowButton.styles";
import ProfileActionButton from "components/ProfileActionButton/ProfileActionButton";
import { EllipsisIcon, FollowIcon, UnfollowIcon } from "icons/StemstrIcon";
import { useNDK } from "ndk/NDKProvider";
import useContactList from "ndk/hooks/useContactList";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "store/Auth";

type FollowButtonProps = {
  pubkey: string;
};

export default function FollowButton({ pubkey }: FollowButtonProps) {
  const { classes, cx } = useStyles();
  const { ndk } = useNDK();
  const authState = useSelector(selectAuthState);
  const { contactList, setContactList } = useContactList({
    hexpubkey: authState.pk,
  });
  const isFollowing = useMemo(
    () => contactList && contactList.tags.some((tag) => tag[1] === pubkey),
    [contactList, pubkey]
  );

  const handleClick = () => {
    if (!contactList || !authState.pk) return;

    const newContactList = new NDKEvent(ndk, contactList.rawEvent());
    newContactList.sig = undefined;
    newContactList.created_at = Math.floor(Date.now() / 1000);
    if (isFollowing) {
      newContactList.tags = newContactList.tags.filter(
        (tag) => tag[1] !== pubkey
      );
    } else {
      const newFollowTag: NDKTag = ["p", pubkey, ""]; // TODO: add relay hint
      newContactList.tags.push(newFollowTag);
    }
    newContactList.publish().then(() => {
      setContactList(newContactList);
    });
  };

  let text = isFollowing ? "Unfollow" : "Follow";
  let Icon = isFollowing ? UnfollowIcon : FollowIcon;
  if (!contactList) {
    text = "";
    Icon = EllipsisIcon;
  }

  return (
    <ProfileActionButton
      onClick={handleClick}
      className={cx(classes.button, {
        [classes.disabled]: !contactList,
      })}
      sx={{ minWidth: 101.41 }}
    >
      <Icon width={16} height={16} />
      {text && (
        <Text lh="normal" ml={8}>
          {text}
        </Text>
      )}
    </ProfileActionButton>
  );
}

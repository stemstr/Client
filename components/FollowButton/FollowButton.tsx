import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { NDKEvent, NDKTag } from "@nostr-dev-kit/ndk";
import { EllipsisIcon, FollowIcon, UnfollowIcon } from "icons/StemstrIcon";
import { useNDK } from "ndk/NDKProvider";
import useContactList from "ndk/hooks/useContactList";
import { MouseEventHandler, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState, setIsNewlyCreatedUser } from "store/Auth";

type FollowButtonProps = {
  pubkey: string;
  children: (props: {
    isFollowing: boolean;
    enabled: boolean;
    handleClick: MouseEventHandler;
    Icon: (props: any) => JSX.Element;
  }) => JSX.Element;
};

export default function FollowButton({ pubkey, children }: FollowButtonProps) {
  const { ndk } = useNDK();
  const dispatch = useDispatch();
  const authState = useSelector(selectAuthState);
  const { contactList, setContactList } = useContactList({
    hexpubkey: authState.pk,
  });
  const isFollowing = useMemo(
    () =>
      Boolean(contactList && contactList.tags.some((tag) => tag[1] === pubkey)),
    [contactList, pubkey]
  );
  const [confirmOverwriteModalOpened, setConfirmOverwriteModalOpened] =
    useState(false);

  const handleClick = () => {
    if (!contactList || !authState.pk) return;
    if (!contactList.tags.length && !authState.isNewlyCreatedUser) {
      setConfirmOverwriteModalOpened(true);
    } else {
      follow();
    }
  };

  const handleConfirmOverwrite = () => {
    setConfirmOverwriteModalOpened(false);
    follow();
  };

  const follow = () => {
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
      dispatch(setIsNewlyCreatedUser(false));
    });
  };

  let Icon = isFollowing ? UnfollowIcon : FollowIcon;
  if (!contactList) {
    Icon = EllipsisIcon;
  }

  return (
    <>
      <Modal
        opened={confirmOverwriteModalOpened}
        onClose={() => setConfirmOverwriteModalOpened(false)}
        title="Warning!"
      >
        <Stack>
          <Text>
            We haven't found an existing contact list for you. If you already
            have a contact list, this action will cause you to lose your
            contacts.
          </Text>
          <Text>
            If this is your first time following someone, you can safely
            proceed.
          </Text>
          <Group>
            <Button
              onClick={() => setConfirmOverwriteModalOpened(false)}
              variant="light"
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmOverwrite}>Proceed</Button>
          </Group>
        </Stack>
      </Modal>
      {children({
        isFollowing,
        enabled: Boolean(contactList),
        handleClick,
        Icon,
      })}
    </>
  );
}

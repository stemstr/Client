import { Group, Text } from "@mantine/core";
import useContactList from "ndk/hooks/useContactList";
import { useMemo } from "react";
import useStyles from "./ProfilePage.styles";

type ContactsBarProps = {
  pubkey: string;
};

export default function ContactsBar({ pubkey }: ContactsBarProps) {
  const { classes } = useStyles();

  return (
    <Group spacing="xl" position="center" className={classes.contactsBar}>
      <FollowingButton pubkey={pubkey} />
      <Text>
        <Text span fw={700}>
          ?
        </Text>{" "}
        followers
      </Text>
      <Text>
        <Text span fw={700}>
          0
        </Text>{" "}
        relays
      </Text>
    </Group>
  );
}

const FollowingButton = ({ pubkey }: { pubkey: string }) => {
  const { contactList } = useContactList({ hexpubkey: pubkey });
  const followingCount = useMemo(
    () => contactList?.tags.filter((tag) => tag[0] === "p").length,
    [contactList]
  );

  return (
    <Text>
      <Text span fw={700}>
        {followingCount || 0}
      </Text>{" "}
      following
    </Text>
  );
};

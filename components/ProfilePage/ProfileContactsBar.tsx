import { Anchor, Group, Text } from "@mantine/core";
import useContactList from "ndk/hooks/useContactList";
import { useMemo, useState } from "react";
import useStyles from "./ProfilePage.styles";
import useFollowers from "ndk/hooks/useFollowers";
import Link from "next/link";
import { Route } from "enums";
import { getPublicKeys } from "ndk/utils";

type ContactsBarProps = {
  pubkey: string;
};

export default function ContactsBar({ pubkey }: ContactsBarProps) {
  const { classes } = useStyles();

  return (
    <Group spacing="xl" position="center" className={classes.contactsBar}>
      <FollowingButton pubkey={pubkey} />
      <FollowersButton pubkey={pubkey} />
      {/* <RelaysButton pubkey={pubkey} /> */}
    </Group>
  );
}

const FollowingButton = ({ pubkey }: { pubkey: string }) => {
  const { npub } = useMemo(() => getPublicKeys(pubkey as string), [pubkey]);
  const { contactList } = useContactList({ pubkey: pubkey });
  const followingCount = useMemo(
    () => contactList?.tags.filter((tag) => tag[0] === "p").length,
    [contactList]
  );

  return (
    <Anchor component={Link} href={`${Route.User}/${npub}/contacts/following`}>
      <Text>
        <Text span fw={700}>
          {followingCount || 0}
        </Text>{" "}
        following
      </Text>
    </Anchor>
  );
};

const FollowersButton = ({ pubkey }: { pubkey: string }) => {
  const { npub } = useMemo(() => getPublicKeys(pubkey as string), [pubkey]);
  const [enabled, setEnabled] = useState(false);
  const followers = useFollowers({ pubkey, enabled });

  const handleClick = () => {
    setEnabled(true);
  };

  const children = (
    <Text onClick={handleClick} sx={{ cursor: "pointer" }}>
      <Text span fw={700}>
        {followers ? followers.length : "?"}
      </Text>{" "}
      followers
    </Text>
  );

  return enabled ? (
    <Anchor component={Link} href={`${Route.User}/${npub}/contacts/followers`}>
      {children}
    </Anchor>
  ) : (
    children
  );
};

const RelaysButton = ({ pubkey }: { pubkey: string }) => {
  const { npub } = useMemo(() => getPublicKeys(pubkey as string), [pubkey]);

  return (
    <Anchor component={Link} href={`${Route.User}/${npub}/contacts/relays`}>
      <Text>
        <Text span fw={700}>
          ?
        </Text>{" "}
        relays
      </Text>
    </Anchor>
  );
};

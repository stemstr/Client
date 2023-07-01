import { useRouter } from "next/router";
import { Group, Tabs, Text } from "@mantine/core";
import { Route } from "enums";
import { useMemo } from "react";
import { getPublicKeys } from "ndk/utils";
import Head from "next/head";
import BackButton from "components/BackButton/BackButton";
import { ChevronLeftIcon } from "icons/StemstrIcon";
import { useUser } from "ndk/hooks/useUser";
import FollowingPanel from "components/ContactsTray/FollowingPanel";
import FollowersPanel from "components/ContactsTray/FollowersPanel";
import RelaysPanel from "components/ContactsTray/RelaysPanel";
import useContactList from "ndk/hooks/useContactList";

export default function Contacts() {
  const router = useRouter();
  const { hexOrNpub, tab } = router.query;
  const { pk, npub } = useMemo(
    () => getPublicKeys(hexOrNpub as string),
    [hexOrNpub]
  );
  const user = useUser(pk);
  const { contactList } = useContactList({ hexpubkey: pk });
  const followingCount = useMemo(
    () => contactList?.tags.filter((tag) => tag[0] === "p").length,
    [contactList]
  );

  const getTitle = (tab: string) => {
    switch (tab) {
      case "following":
        return "Following";
      case "followers":
        return "Followers";
      case "relays":
        return "Relays";
    }
  };

  return (
    <>
      <Head>
        <title>
          Stemstr - {getTitle(tab as string)}
          {user?.profile?.displayName && ` - ${user.profile.displayName}`}
        </title>
      </Head>
      <Group p="md" spacing="sm" align="center" c="white">
        <BackButton defaultUrl={`${Route.User}/${npub}`}>
          <ChevronLeftIcon width={24} height={24} />
        </BackButton>
        <Text c="white" fw="bold" fz={24} lh="normal">
          {user?.profile?.displayName || `${npub.slice(0, 9)}...`}
        </Text>
      </Group>
      <Tabs
        value={tab as string}
        onTabChange={(value) =>
          router.replace(`${Route.User}/${npub}/contacts/${value}`)
        }
        styles={{
          tab: {
            paddingTop: 14,
            paddingBottom: 14,
          },
        }}
      >
        <Tabs.List grow>
          <Tabs.Tab value="following">Following {followingCount}</Tabs.Tab>
          <Tabs.Tab value="followers">Followers</Tabs.Tab>
          <Tabs.Tab value="relays">Relays</Tabs.Tab>
        </Tabs.List>
        <FollowingPanel contactList={contactList} />
        <FollowersPanel />
        <RelaysPanel />
      </Tabs>
    </>
  );
}

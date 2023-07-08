import { Center, Tabs } from "@mantine/core";
import { Route } from "enums";
import useContactList from "ndk/hooks/useContactList";
import { getPublicKeys } from "ndk/utils";
import { useRouter } from "next/router";
import { useMemo } from "react";
import FollowingPanel from "./FollowingPanel";
import FollowersPanel from "./FollowersPanel";
import RelaysPanel from "./RelaysPanel";
import useStyles from "components/ContactsTray/ContactsTray.styles";

type ContactsTrayProps = {
  pubkey: string;
  tab: string;
};

export default function ContactsTray({ pubkey, tab }: ContactsTrayProps) {
  const router = useRouter();
  const { classes } = useStyles();
  const { npub } = getPublicKeys(pubkey);
  const { contactList } = useContactList({ pubkey: pubkey });
  const followingCount = useMemo(
    () => contactList?.tags.filter((tag) => tag[0] === "p").length,
    [contactList]
  );

  const Count = ({ count }: { count?: any }) => {
    if (count === undefined) count = "?";
    return (
      <Center className={classes.count} sx={{ borderRadius: 10 }}>
        {count}
      </Center>
    );
  };

  return (
    <Tabs
      value={tab as string}
      onTabChange={(value) =>
        router.replace(`${Route.User}/${npub}/contacts/${value}`)
      }
      classNames={{
        tab: classes.tab,
        tabLabel: classes.tabLabel,
        tabRightSection: classes.tabRightSection,
      }}
    >
      <Tabs.List grow>
        <Tabs.Tab
          value="following"
          rightSection={<Count count={followingCount} />}
        >
          Following
        </Tabs.Tab>
        <Tabs.Tab value="followers" rightSection={<Count count={"?"} />}>
          Followers
        </Tabs.Tab>
        <Tabs.Tab value="relays" rightSection={<Count count={"?"} />}>
          Relays
        </Tabs.Tab>
      </Tabs.List>
      <FollowingPanel contactList={contactList} />
      <FollowersPanel />
      <RelaysPanel />
    </Tabs>
  );
}

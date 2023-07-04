import { Tabs } from "@mantine/core";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useMemo } from "react";
import UserFeed from "./UserFeed";

type FollowersPanelProps = {
  contactList?: NDKEvent;
};

export default function FollowingPanel({ contactList }: FollowersPanelProps) {
  const headerHeight = 111;
  const height = `calc(100vh - ${headerHeight}px)`;
  const followingPubkeys: string[] = useMemo(
    () =>
      contactList?.tags.filter((tag) => tag[0] === "p").map((tag) => tag[1]) ||
      [],
    [contactList]
  );

  return (
    <Tabs.Panel value="following" pl="md" pr="md">
      <UserFeed pubkeys={followingPubkeys} height={height} />
    </Tabs.Panel>
  );
}

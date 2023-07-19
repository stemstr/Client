import { Feed } from "../Feed";
import useHomeFeedPubkeys from "../../ndk/hooks/useHomeFeedPubkeys";
import { useMemo } from "react";
import { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
import { Kind } from "nostr-tools";

const isRootEvent = (event: NDKEvent): boolean => {
  return !event.tags.find((tag) => tag[0] === "e");
};

const isHomeFeedEvent = (event: NDKEvent): boolean => {
  switch (event.kind) {
    case Kind.Text:
      return isRootEvent(event);
    case 6:
      return true;
    case 16:
      return true;
    case 1808:
      return isRootEvent(event);
    default:
      return false;
  }
};

export default function HomeFeed() {
  const pubkeys = useHomeFeedPubkeys();
  const pubkeyHash = pubkeys.join();
  const filter = useMemo<NDKFilter>(
    () => ({
      kinds: [1, 1808 as Kind],
      limit: 50,
      authors: pubkeys,
    }),
    [pubkeyHash]
  );

  return pubkeys.length > 0 ? (
    <Feed filter={filter} feedFilter={isHomeFeedEvent} />
  ) : null;
}

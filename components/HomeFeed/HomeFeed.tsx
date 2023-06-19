import { Feed } from "../Feed";
import useHomeFeedPubkeys from "../../ndk/hooks/useHomeFeedPubkeys";
import { useMemo } from "react";
import { NDKFilter } from "@nostr-dev-kit/ndk";
import { Kind } from "nostr-tools";

export default function HomeFeed() {
  const pubkeys = useHomeFeedPubkeys();
  const pubkeyHash = pubkeys.join();
  const filter = useMemo<NDKFilter>(
    () => ({
      kinds: [1, 1808 as Kind],
      limit: 100,
      authors: pubkeys,
    }),
    [pubkeyHash]
  );

  return pubkeys.length > 0 ? <Feed filter={filter} /> : null;
}

import { useMemo } from "react";
import { type Kind } from "nostr-tools";
import { type NDKFilter } from "@nostr-dev-kit/ndk";
import { useFeedWithEose } from "./useFeedWithEose";

export function useHomeFeed(pubkeys: string[]) {
  const pubkeyHash = pubkeys.join();
  const filter = useMemo<NDKFilter>(
    () => ({
      kinds: [1, 1808 as Kind],
      limit: 100,
      authors: pubkeys,
    }),
    [pubkeyHash]
  );
  const events = useFeedWithEose(filter, [
    process.env.NEXT_PUBLIC_STEMSTR_RELAY as string,
  ]);

  return events.filter((event) => !event.tags.find((tag) => tag[0] === "e"));
}

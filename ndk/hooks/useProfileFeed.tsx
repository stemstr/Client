import { useMemo } from "react";
import { useFeed } from "./useFeed";
import { Kind } from "nostr-tools";
import { NDKFilter } from "@nostr-dev-kit/ndk";

export function useProfileFeed({ pubkey }: { pubkey: string }) {
  const filter = useMemo<NDKFilter>(
    () => ({
      kinds: [1, 1808 as Kind],
      authors: [pubkey],
    }),
    []
  );
  const events = useFeed(filter, [
    process.env.NEXT_PUBLIC_STEMSTR_RELAY as string,
  ]);

  return events;
}

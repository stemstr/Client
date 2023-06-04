import { useMemo } from "react";
import { useFeed } from "./useFeed";
import { Kind } from "nostr-tools";
import { NDKFilter } from "@nostr-dev-kit/ndk";

export function useDiscoverFeed({ tags }: { tags?: string[] }) {
  const filter = useMemo<NDKFilter>(() => {
    const newFilter: NDKFilter = {
      kinds: [1, 1808 as Kind],
      limit: 100,
    };
    if (tags) newFilter["#t"] = tags;
    return newFilter;
  }, [tags?.length]);
  const events = useFeed(filter, [
    process.env.NEXT_PUBLIC_STEMSTR_RELAY as string,
  ]);

  return events;
}

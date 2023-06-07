import { useMemo } from "react";
import { useFeed } from "./useFeed";
import { type Kind } from "nostr-tools";
import { type NDKEvent } from "@nostr-dev-kit/ndk";

export function useEventReplies(rootEvent: NDKEvent | null) {
  const filter = useMemo(
    () => ({ kinds: [1, 1808 as Kind], "#e": [rootEvent ? rootEvent.id : ""] }),
    [rootEvent?.id]
  );

  return useFeed(filter);
}

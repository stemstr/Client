import {
  type NDKEvent,
  type NDKFilter,
  NDKSubscription,
} from "@nostr-dev-kit/ndk";
import { useNDK } from "ndk/NDKProvider";
import { createRelaySet } from "ndk/utils";
import { useEffect, useRef, useState } from "react";
import { chunkArray } from "../../utils/common";

export function useFeedWithEose(filter: NDKFilter, relayUrls: string[] = []) {
  const { ndk } = useNDK();
  const [feed, setFeed] = useState<NDKEvent[]>([]);
  const eventBatch = useRef<NDKEvent[] | null>([]);
  const eoseCount = useRef(0);
  const sortedFeed = feed.sort(
    (a, b) => (b.created_at ?? 0) - (a.created_at ?? 0)
  );

  useEffect(() => {
    if (!ndk) {
      return;
    }

    const relaySet = createRelaySet(relayUrls, ndk);

    // many relays have a max of 256 authors
    const maxAuthors = 256;

    const hasAuthorsInFilter = filter.authors?.length ?? 0;
    const filters = hasAuthorsInFilter
      ? chunkArray(filter.authors, maxAuthors).map((authors) => ({
          ...filter,
          authors,
        }))
      : [filter];
    const subscriptions: NDKSubscription[] = [];

    filters.forEach((filter) => {
      subscriptions.push(ndk.subscribe(filter, undefined, relaySet));
    });
    subscriptions.forEach((subscription) => {
      subscription.on("event", (event: NDKEvent) => {
        if (eventBatch.current === null) {
          setFeed((prev) => [event, ...prev]);
        } else {
          eventBatch.current.push(event);
        }
      });
      subscription.on("eose", () => {
        const newEoseCount = eoseCount.current + 1;

        if (eventBatch.current) {
          setFeed(eventBatch.current);
        }

        // only batching until eose received for all subscriptions
        if (newEoseCount === subscriptions.length) {
          eventBatch.current = null;
        }

        eoseCount.current = newEoseCount;
      });
    });

    return () => {
      subscriptions.forEach((subscription) => {
        subscription.stop();
      });
      eoseCount.current = 0;
      eventBatch.current = null;
      setFeed([]);
    };
  }, [filter, setFeed, ndk]);

  return sortedFeed;
}

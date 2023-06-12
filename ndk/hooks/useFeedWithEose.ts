import { type NDKEvent, type NDKFilter } from "@nostr-dev-kit/ndk";
import { useNDK } from "ndk/NDKProvider";
import { createRelaySet } from "ndk/utils";
import { useEffect, useRef, useState } from "react";

export function useFeedWithEose(filter: NDKFilter, relayUrls: string[] = []) {
  const { ndk } = useNDK();
  const [feed, setFeed] = useState<NDKEvent[]>([]);
  const eventBatch = useRef<NDKEvent[] | null>([]);

  useEffect(() => {
    if (!ndk) {
      return;
    }

    const relaySet = createRelaySet(relayUrls, ndk);
    const subscription = ndk.subscribe(filter, undefined, relaySet);

    subscription.on("event", (event: NDKEvent) => {
      if (eventBatch.current === null) {
        setFeed((prev) => [event, ...prev]);
      } else {
        eventBatch.current.push(event);
      }
    });
    subscription.on("eose", () => {
      if (eventBatch.current) {
        setFeed(eventBatch.current);
      }
      eventBatch.current = null;
    });

    return () => {
      if (subscription) subscription.stop();
    };
  }, [filter, setFeed, ndk]);

  return feed;
}

import NDK, {
  NDKEvent,
  NDKFilter,
  NDKRelay,
  NDKRelaySet,
  NDKSubscription,
  NDKSubscriptionOptions,
} from "@nostr-dev-kit/ndk";
import { useNDK } from "ndk/NDKProvider";
import { uniqBy } from "ndk/utils";
import { useCallback, useEffect, useRef, useState } from "react";

export function useFeed(filter: NDKFilter, relayUrls: string[] = []) {
  const { ndk } = useNDK();
  const [feed, setFeed] = useState<NDKEvent[]>([]);

  const eventBatch = useRef<NDKEvent[]>([]);

  const processEventBatch = useCallback(() => {
    if (eventBatch.current.length) {
      setFeed((prev) => {
        const newEvents = uniqBy([...eventBatch.current, ...prev], "id").sort(
          (a, b) => (b.created_at as number) - (a.created_at as number)
        );
        eventBatch.current = [];
        return newEvents;
      });
    }
  }, []);

  useEffect(() => {
    const debounceId = setInterval(processEventBatch, 500);
    return () => clearInterval(debounceId);
  }, [500, processEventBatch]);

  useEffect(() => {
    let subscription: NDKSubscription;
    let opts: NDKSubscriptionOptions = { closeOnEose: false };
    let relaySet: NDKRelaySet | undefined;
    if (ndk) {
      if (relayUrls.length) {
        const relays: Set<NDKRelay> = new Set();
        ndk.pool?.relays.forEach((relay) => {
          if (relayUrls.find((url) => url === relay.url)) {
            relays.add(relay);
          }
        });
        relaySet = new NDKRelaySet(relays, ndk);
      }
      subscription = ndk.subscribe(filter, opts, relaySet);
      subscription.on("event", (event: NDKEvent) => {
        eventBatch.current.push(event);
      });
    }
    return () => {
      if (subscription) subscription.stop();
    };
  }, [filter, setFeed]);

  return feed;
}

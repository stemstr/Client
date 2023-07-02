import {
  NDKEvent,
  NDKFilter,
  NDKSubscription,
  NDKUser,
} from "@nostr-dev-kit/ndk";
import { useNDK } from "ndk/NDKProvider";
import { Kind } from "nostr-tools";
import { useEffect, useRef, useState } from "react";

type UseFollowersProps = {
  pubkey: string;
  enabled: boolean;
  throttle?: number;
};

export default function useFollowers({
  pubkey,
  enabled,
  throttle = 100,
}: UseFollowersProps): NDKUser[] | undefined {
  const { ndk } = useNDK();
  const [contactLists, setContactLists] = useState<NDKEvent[]>([]);
  const [followers, setFollowers] = useState<NDKUser[]>();
  const filter: NDKFilter = {
    kinds: [Kind.Contacts],
    "#p": [pubkey],
  };
  const eventBatch = useRef<NDKEvent[]>([]);

  const processEventBatch = () => {
    setContactLists((prev) => {
      const uniqueEvents = [...prev, ...eventBatch.current].reduce<NDKEvent[]>(
        (acc, event) => {
          if (!acc.some((item) => item.id === event.id)) {
            acc.push(event);
          }
          return acc;
        },
        []
      );
      const sortedEvents = uniqueEvents.sort(
        (a, b) => b.created_at! - a.created_at!
      );
      eventBatch.current = [];
      return sortedEvents;
    });
  };

  useEffect(() => {
    let subscription: NDKSubscription;
    if (enabled && ndk) {
      subscription = ndk.subscribe(filter);
      subscription.on("event", (event: NDKEvent) => {
        eventBatch.current.push(event);
      });
    }

    return () => {
      if (subscription) {
        subscription.stop();
      }
    };
  }, [enabled]);

  useEffect(() => {
    let processEventBatchInterval: NodeJS.Timer;
    if (enabled) {
      processEventBatchInterval = setInterval(processEventBatch, throttle);
    }

    return () => {
      clearInterval(processEventBatchInterval);
    };
  }, [enabled, throttle]);

  useEffect(() => {
    if (ndk) {
      setFollowers(
        contactLists.map((event) => ndk.getUser({ hexpubkey: event.pubkey }))
      );
    }
  }, [contactLists.length, setFollowers]);

  return enabled ? followers : undefined;
}

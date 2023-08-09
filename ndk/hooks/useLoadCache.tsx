import NDK, { NDKFilter, NostrEvent } from "@nostr-dev-kit/ndk";
import localforage from "localforage";
import {
  profileEventsCacheKey,
  setProfileEventsCache,
} from "ndk/inMemoryCacheAdapter";
import { Kind } from "nostr-tools";
import { useEffect, useRef } from "react";

export default function useLoadCache(ndk?: NDK) {
  const profileEventsToRefresh = useRef<NostrEvent[]>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localforage
        .getItem(profileEventsCacheKey)
        .then((value) => {
          if (typeof value === "object" && value !== null) {
            const profileEventsCache = value as Record<string, NostrEvent>;
            setProfileEventsCache(profileEventsCache);
            profileEventsToRefresh.current = Object.values(profileEventsCache);
          }
        })
        .catch((error) => {});
    }
  }, []);

  useEffect(() => {
    let refreshEventsTimeout: NodeJS.Timeout | undefined;
    if (ndk) {
      refreshEventsTimeout = setTimeout(() => {
        if (profileEventsToRefresh.current?.length) {
          const batch = profileEventsToRefresh.current.splice(0, 128);
          const filter: NDKFilter = {
            kinds: [Kind.Metadata],
            authors: batch.map((event) => event.pubkey),
          };
          ndk.fetchEvents(filter);
        }
      }, 1000);
    }

    return () => {
      clearTimeout(refreshEventsTimeout);
    };
  }, [ndk]);
}

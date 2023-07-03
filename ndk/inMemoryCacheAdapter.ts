import NDK, {
  NDKEvent,
  type NDKSubscription,
  type NostrEvent,
  mergeEvent,
} from "@nostr-dev-kit/ndk";
import { Kind } from "nostr-tools";

const eventsCache: Record<string, Record<string, NostrEvent>> = {};

const profileEventsCache: Record<string, NostrEvent> = {};

const relayListCache: Record<string, NostrEvent> = {};

export const getCachedProfile = (pubkey: string, ndk?: NDK) => {
  const cachedProfile = profileEventsCache[pubkey];

  if (ndk && cachedProfile) {
    const ndkEvent = new NDKEvent(ndk, cachedProfile);

    return mergeEvent(ndkEvent, {});
  }
};

export const getCachedUser = (pubkey?: string, ndk?: NDK) => {
  if (!pubkey) {
    return;
  }

  const cachedProfile = profileEventsCache[pubkey];

  if (ndk && cachedProfile) {
    const ndkEvent = new NDKEvent(ndk, cachedProfile);
    const ndkUser = ndkEvent.author;

    ndkUser.profile = mergeEvent(ndkEvent, {});

    return ndkUser;
  }
};

const makeCacheKey = (pubkey: string, kind: number) => `${pubkey}:${kind}`;

const inMemoryCacheAdapter = {
  locking: true,
  async query(subscription: NDKSubscription) {
    const { filter } = subscription;
    const { authors, kinds } = filter;

    // currently only supporting profile and relay list caching.
    // authors and kinds are available for profile caching.
    if (!authors || !kinds) {
      return;
    }

    authors.forEach((pubkey: string) => {
      kinds.forEach((kind: number) => {
        if (![Kind.Metadata, Kind.RelayList].includes(kind)) {
          return;
        }

        const cache =
          kind === Kind.Metadata ? profileEventsCache : relayListCache;
        const cachedEvent = cache[pubkey];

        if (cachedEvent) {
          const ndkEvent = new NDKEvent(subscription.ndk, cachedEvent);

          subscription.eventReceived(ndkEvent, undefined, true);
        }
      });
    });
  },
  async setEvent(event: NDKEvent) {
    // caching only certain types of kinds for now to make sure logic is correct
    const whitelistedKinds = [Kind.Metadata, Kind.RelayList];

    if (event.kind === undefined || !whitelistedKinds.includes(event.kind)) {
      return;
    }

    // only cache the most recent event for kind 0 and kind 10002
    if ([Kind.Metadata, Kind.RelayList].includes(event.kind)) {
      const key = event.pubkey;
      const cache =
        event.kind === Kind.Metadata ? profileEventsCache : relayListCache;

      if (
        !cache[key] ||
        (cache[key] &&
          event.created_at &&
          event.created_at > cache[key].created_at)
      ) {
        cache[key] = await event.toNostrEvent();
      }

      return;
    }

    const key = makeCacheKey(event.pubkey, event.kind);

    if (!eventsCache[key]) {
      eventsCache[key] = {};
    }

    if (!eventsCache[key][event.id]) {
      eventsCache[key][event.id] = await event.toNostrEvent();
    }
  },
};

export default inMemoryCacheAdapter;

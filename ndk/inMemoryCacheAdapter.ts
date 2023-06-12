import NDK, {
  NDKEvent,
  type NDKSubscription,
  type NostrEvent,
  mergeEvent,
} from "@nostr-dev-kit/ndk";

const eventsCache: Record<string, Record<string, NostrEvent>> = {};

const profileEventsCache: Record<string, NostrEvent> = {};

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
    const ndkUser = ndkEvent.author();

    ndkUser.profile = mergeEvent(ndkEvent, {});

    return ndkUser;
  }
};

const makeCacheKey = (pubkey: string, kind: number) => `${pubkey}:${kind}`;

const inMemoryCacheAdapter = {
  locking: true,
  async query(subscription: NDKSubscription) {
    const { filter } = subscription;

    // currently only supporting profile caching
    if (!filter.authors || !filter.kinds || filter.kinds[0] !== 0) {
      return;
    }

    filter.authors.forEach((pubkey: string) => {
      const cachedProfile = profileEventsCache[pubkey];

      if (cachedProfile) {
        const ndkEvent = new NDKEvent(subscription.ndk, cachedProfile);

        subscription.eventReceived(ndkEvent, undefined, true);
      }
    });
  },
  async setEvent(event: NDKEvent) {
    // caching only certain types of kinds for now to make sure logic is correct
    const whitelistedKinds = [0];

    if (event.kind === undefined || !whitelistedKinds.includes(event.kind)) {
      return;
    }

    // only cache the most recent event for kind 0
    if (event.kind === 0) {
      const key = event.pubkey;

      if (
        !profileEventsCache[key] ||
        (profileEventsCache[key] &&
          event.created_at &&
          event.created_at > profileEventsCache[key].created_at)
      ) {
        profileEventsCache[key] = await event.toNostrEvent();
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

import NDK, {
  NDKEvent,
  type NDKSubscription,
  type NostrEvent,
  mergeEvent,
} from "@nostr-dev-kit/ndk";
import axios from "axios";
import { Kind } from "nostr-tools";

const eventsCache: Record<string, Record<string, NostrEvent>> = {};

const profileEventsCache: Record<string, NostrEvent> = {};

const nip05StatusCache: Record<string, Nip05Status> = {};

const makeNip05StatusKey = (nip05: string, pubkey: string) => {
  return `${nip05}/${pubkey}`;
};

export enum Nip05Status {
  Valid = 1,
  Invalid = 2,
}

export const getNip05Status = async (
  nip05: string,
  pubkey: string
): Promise<Nip05Status> => {
  return new Promise<Nip05Status>(async (resolve, reject) => {
    const key = makeNip05StatusKey(nip05, pubkey);
    if (nip05StatusCache[key] !== undefined) {
      resolve(nip05StatusCache[key]);
      return;
    }
    const [name, domain] = nip05.split("@");
    if (!(name && domain)) {
      nip05StatusCache[key] = Nip05Status.Invalid;
      resolve(Nip05Status.Invalid);
    } else {
      axios
        .get(`https://${domain}/.well-known/nostr.json?name=${name}`)
        .then((response) => {
          if (response.data.names[name] === pubkey) {
            nip05StatusCache[key] = Nip05Status.Valid;
            resolve(Nip05Status.Valid);
          } else {
            nip05StatusCache[key] = Nip05Status.Invalid;
            resolve(Nip05Status.Invalid);
          }
        });
    }
  });
};

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
    const { authors, kinds } = filter;

    // currently only supporting profile caching and authors and kinds are available for profile caching
    if (!authors || !kinds) {
      return;
    }

    authors.forEach((pubkey: string) => {
      if (!kinds.includes(Kind.Metadata)) {
        return;
      }

      const cachedProfile = profileEventsCache[pubkey];

      if (cachedProfile) {
        const ndkEvent = new NDKEvent(subscription.ndk, cachedProfile);

        subscription.eventReceived(ndkEvent, undefined, true);
      }
    });
  },
  async setEvent(event: NDKEvent) {
    // caching only certain types of kinds for now to make sure logic is correct
    const whitelistedKinds = [Kind.Metadata];

    if (event.kind === undefined || !whitelistedKinds.includes(event.kind)) {
      return;
    }

    // only cache the most recent event for kind 0
    if (event.kind === Kind.Metadata) {
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

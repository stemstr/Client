import NDK, {
  NDKEvent,
  NDKFilter,
  NDKRelay,
  NDKRelaySet,
  NDKTag,
  NDKUser,
} from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";
import { NDKSubscriptionOptions } from "@nostr-dev-kit/ndk/lib/src/subscription";

interface ParsedEventTags {
  root?: NDKTag;
  mentions: NDKTag[];
  reply?: NDKTag;
}

export const parseEventTags = (event: NDKEvent) => {
  const result: ParsedEventTags = {
    root: undefined,
    mentions: [],
    reply: undefined,
  };
  const eTags = event.tags.filter((t) => t[0] === "e");
  if (usesDepecratedETagSchema(event)) {
    if (eTags) {
      if (eTags.length === 1) {
        result.reply = eTags[0];
      }
      if (eTags.length > 0) {
        result.root = eTags[0];
      }
      if (eTags.length > 1) {
        console.log(eTags);
        result.reply = eTags[eTags.length - 1];
      }
      if (eTags.length > 2) {
        for (let i = 1; i < eTags.length - 1; i++) {
          result.mentions.push(eTags[i]);
        }
      }
    }
  } else {
    eTags?.forEach((t) => {
      switch (t[3]) {
        case "root":
          result.root = t;
          break;
        case "reply":
          result.reply = t;
          break;
        case "mention":
          result.mentions.push(t);
          break;
      }
    });
  }
  if (result.root) {
    result.root = formatETag(result.root, "root");
  }
  result.mentions.forEach((mention, i) => {
    if (mention) {
      result.mentions[i] = formatETag(mention, "mention");
    }
  });
  if (result.reply) {
    result.reply = formatETag(result.reply, "reply");
  }
  return result;
};

export const formatETag = (
  tag: NDKTag,
  type: "root" | "mention" | "reply"
): NDKTag => {
  if (!tag[2]) {
    tag[2] = "";
  }
  tag[3] = type;
  return tag;
};

export const usesDepecratedETagSchema = (event: NDKEvent | undefined) => {
  if (!event) return false;
  const tag = event.tags.find((t) => t[0] === "e");
  if (tag && tag[3] !== undefined) {
    return false;
  }
  return !!tag;
};

export const uniqBy = <T,>(arr: T[], key: keyof T): T[] => {
  return Object.values(
    arr.reduce(
      (map, item) => ({
        ...map,
        [`${item[key]}`]: item,
      }),
      {}
    )
  );
};

export const dateToUnix = (_date?: Date) => {
  const date = _date || new Date();

  return Math.floor(date.getTime() / 1000);
};

export const getRelativeTimeString = (unixTime: number) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const differenceInSeconds = currentTime - unixTime;

  const secondsInMinute = 60;
  const secondsInHour = secondsInMinute * 60;
  const secondsInDay = secondsInHour * 24;
  const secondsInWeek = secondsInDay * 7;
  const secondsInMonth = secondsInDay * 30; // Approximation
  const secondsInYear = secondsInDay * 365; // Approximation

  if (differenceInSeconds < secondsInMinute) {
    return `${differenceInSeconds}s`;
  } else if (differenceInSeconds < secondsInHour) {
    const minutes = Math.floor(differenceInSeconds / secondsInMinute);
    return `${minutes}m`;
  } else if (differenceInSeconds < secondsInDay) {
    const hours = Math.floor(differenceInSeconds / secondsInHour);
    return `${hours}h`;
  } else if (differenceInSeconds < secondsInWeek) {
    const days = Math.floor(differenceInSeconds / secondsInDay);
    return `${days}d`;
  } else if (differenceInSeconds < secondsInMonth) {
    const weeks = Math.floor(differenceInSeconds / secondsInWeek);
    return `${weeks}w`;
  } else if (differenceInSeconds < secondsInYear) {
    const months = Math.floor(differenceInSeconds / secondsInMonth);
    return `${months}mo`;
  } else {
    const years = Math.floor(differenceInSeconds / secondsInYear);
    return `${years}y`;
  }
};

export const getPublicKeys = (
  hexOrNpub: string
): { pk: string; npub: string } => {
  const publicKeys = { pk: "", npub: "" };
  if (isNpub(hexOrNpub)) {
    publicKeys.npub = hexOrNpub;
    let { type, data } = nip19.decode(hexOrNpub);
    publicKeys.pk = data as string;
  } else if (isHexPubkey(hexOrNpub)) {
    publicKeys.pk = hexOrNpub;
    publicKeys.npub = nip19.npubEncode(hexOrNpub);
  } else {
    // TODO: throw error
  }
  return publicKeys;
};

// TODO: Write this function fr
export const isNpub = (hexOrNpub: string): boolean => {
  return hexOrNpub.startsWith("npub1");
};

// TODO: Write this function fr
export const isHexPubkey = (hexOrNpub: string): boolean => {
  return !isNpub(hexOrNpub);
};

export const abbreviateKey = (key: string): string => {
  return `${key.slice(0, 12)}...${key.slice(-12)}`;
};

export const getNoteIds = (noteId: string): { hex: string; bech32: string } => {
  // TODO: Error handling, etc.
  const ids = { hex: "", bech32: "" };
  if (noteId.startsWith("note")) {
    ids.bech32 = noteId;
    let { type, data } = nip19.decode(noteId);
    if (typeof data === "string") {
      ids.hex = data;
    }
  } else {
    ids.hex = noteId;
    ids.bech32 = nip19.noteEncode(noteId);
  }
  return ids;
};

export const createRelaySet = (relayUrls: string[], ndk: NDK) => {
  if (!relayUrls.length) {
    return;
  }

  const relays: Set<NDKRelay> = new Set();

  relayUrls.forEach((url) => {
    const relay = ndk.pool?.relays.get(url);

    if (relay) {
      relays.add(relay);
    }
  });

  return new NDKRelaySet(relays, ndk);
};

export const dedupeEvent = (event1: NDKEvent, event2: NDKEvent) => {
  // return the newest of the two
  if (event1.created_at! > event2.created_at!) {
    return event1;
  }

  return event2;
};

export const fetchEvents = async (
  filter: NDKFilter,
  ndk: NDK,
  relaySet?: NDKRelaySet,
  opts?: NDKSubscriptionOptions
): Promise<Set<NDKEvent>> => {
  return new Promise((resolve) => {
    const events: Map<string, NDKEvent> = new Map();
    const relaySetSubscription = ndk.subscribe(filter, opts, relaySet);

    relaySetSubscription.on("event", (event: NDKEvent) => {
      const existingEvent = events.get(event.tagId());
      if (existingEvent) {
        event = dedupeEvent(existingEvent, event);
      }

      event.ndk = ndk;
      events.set(event.tagId(), event);
    });
    relaySetSubscription.on("eose", () => {
      resolve(new Set(events.values()));
    });

    relaySetSubscription.start();
  });
};

export const getNormalizedName = (pubkey: string, user?: NDKUser) => {
  const profile = user?.profile;

  return (
    profile?.displayName ?? profile?.name ?? `${pubkey.substring(0, 5)}...`
  );
};

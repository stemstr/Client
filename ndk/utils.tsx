import NDK, {
  NDKEvent,
  NDKRelay,
  NDKRelaySet,
  NDKTag,
  NDKUser,
  NDKUserProfile,
  NostrEvent,
  NDKKind,
  NDKPrivateKeySigner,
  NDKNip07Signer,
  NDKSigner,
} from "@nostr-dev-kit/ndk";
import {
  nip19,
  nip57,
  finishEvent,
  generatePrivateKey,
  type EventTemplate,
  Kind,
} from "nostr-tools";
import axios from "axios";
import { bech32 } from "@scure/base";
import { DEFAULT_RELAY_URLS, NPUB_NOSTR_URI_REGEX } from "../constants";
import { AuthState } from "../store/Auth";

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
  const formattedTag: NDKTag = [...tag];
  if (!formattedTag[2]) {
    formattedTag[2] = "";
  }
  formattedTag[3] = type;
  return formattedTag;
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

export const isNpub = (hexOrNpub: string): boolean => {
  try {
    return nip19.decode(hexOrNpub).type === "npub";
  } catch {
    return false;
  }
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

export const getNormalizedName = (pubkey: string, user?: NDKUser) => {
  const profile = user?.profile;

  return (
    profile?.displayName || profile?.name || `${pubkey.substring(0, 5)}...`
  );
};

export const getNormalizedUsername = (user?: NDKUser) => {
  return user?.profile?.name ? `@${user.profile.name}` : "";
};

export const getFormattedName = (user?: NDKUser) => {
  if (user?.profile?.name) return `@${user.profile.name}`;
  return (
    user?.profile?.displayName || `${user?.hexpubkey().substring(0, 5)}...`
  );
};

export const getLnurlServiceEndpoint = (
  zappedUserProfile?: NDKUserProfile,
  zappedEvent?: NDKEvent
) => {
  let lud06: string | undefined;
  let lud16: string | undefined;

  if (zappedEvent) {
    const zapTag = zappedEvent.getMatchingTags("zap")[0];

    if (zapTag) {
      switch (zapTag[2]) {
        case "lud06":
          lud06 = zapTag[1];
          break;
        case "lud16":
          lud16 = zapTag[1];
          break;
        default:
          throw new Error(`Unknown zap tag ${zapTag}`);
      }
    }
  }

  if (!lud06 && !lud16) {
    lud06 = zappedUserProfile?.lud06;
    lud16 = zappedUserProfile?.lud16;
  }

  if (lud16) {
    const [name, domain] = lud16.split("@");
    return `https://${domain}/.well-known/lnurlp/${name}`;
  } else if (lud06) {
    const { words } = bech32.decode(lud06, 1000);
    const data = bech32.fromWords(words);
    const utf8Decoder = new TextDecoder("utf-8");
    return utf8Decoder.decode(data);
  }
};

const getZapEndpoint = async (
  zappedUserProfile?: NDKUserProfile,
  zappedEvent?: NDKEvent
) => {
  const lnurlServiceEndpoint = getLnurlServiceEndpoint(
    zappedUserProfile,
    zappedEvent
  );

  if (!lnurlServiceEndpoint) {
    return;
  }

  const { data } = await axios(lnurlServiceEndpoint);

  if (data?.allowsNostr && (data?.nostrPubkey || data?.nostrPubKey)) {
    return data.callback;
  }
};

const getUserRelayUrls = async (
  user: NDKUser,
  opts?: { filter?: "readable" | "writable" }
) => {
  const relayListEvent = Array.from(await user.relayList())[0];
  const { filter } = opts ?? {};

  if (!relayListEvent) {
    return null;
  }

  return relayListEvent
    .getMatchingTags("r")
    .filter((tag) => {
      if (filter === "readable") {
        return tag[2] === "read" || tag[2] === undefined;
      }

      if (filter === "writable") {
        return tag[2] === "write" || tag[2] === undefined;
      }

      return true;
    })
    .map((tag) => tag[1]);
};

interface SignEventParams {
  eventTemplate: EventTemplate;
  ndk: NDK;
  isAnonymous?: boolean;
}

const signEvent = async ({
  eventTemplate,
  ndk,
  isAnonymous,
}: SignEventParams) => {
  if (isAnonymous) {
    return finishEvent(eventTemplate, generatePrivateKey());
  }

  const event = new NDKEvent(ndk, eventTemplate as NostrEvent);

  await event.sign();

  return await event.toNostrEvent();
};

interface CreateZapRequestParams {
  amount: number; // amount to zap in sats
  comment?: string;
  extraTags?: NDKTag[];
  zappedUser: NDKUser;
  zappedEvent?: NDKEvent;
  ndk: NDK;
  isAnonymous?: boolean;
  currentUser?: NDKUser;
}

export const normalizeRelayUrl = (relayUrl: string): string => {
  return relayUrl.replace(/\/+$/, "");
};

export const createZapRequest = async ({
  amount,
  comment,
  extraTags,
  zappedUser,
  zappedEvent,
  ndk,
  isAnonymous,
  currentUser,
}: CreateZapRequestParams) => {
  const zapEndpoint = await getZapEndpoint(zappedUser.profile, zappedEvent);

  if (!zapEndpoint) {
    throw new Error("No zap endpoint found");
  }

  const normalizedAmount = amount * 1000; // convert to millisats
  const currentUserRelayUrls = currentUser
    ? await getUserRelayUrls(currentUser, {
        filter: "writable",
      })
    : null;
  const defaultRelays = [
    ...DEFAULT_RELAY_URLS,
    process.env.NEXT_PUBLIC_STEMSTR_RELAY as string,
  ];
  let relays = currentUserRelayUrls
    ? [...currentUserRelayUrls, ...defaultRelays]
    : defaultRelays;
  // normalize relay urls
  relays = relays.map(normalizeRelayUrl);

  const zapRequest = nip57.makeZapRequest({
    profile: zappedUser.hexpubkey(),

    // set the event to null since nostr-tools doesn't support nip-33 zaps
    event: null,
    amount: normalizedAmount,
    comment: comment ?? "",
    relays: Array.from(new Set(relays)),
  });

  zapRequest.tags.push(["client", "stemstr.app"]);

  // add the event tag if it exists; this supports both 'e' and 'a' tags
  if (zappedEvent) {
    const tag = zappedEvent.tagReference();
    if (tag) {
      zapRequest.tags.push(tag);
    }
  }

  if (extraTags) {
    zapRequest.tags = zapRequest.tags.concat(extraTags);
  }

  const signedZapRequest = await signEvent({
    eventTemplate: zapRequest,
    ndk,
    isAnonymous,
  });

  const { data } = await axios(
    `${zapEndpoint}?` +
      new URLSearchParams({
        amount: normalizedAmount.toString(),
        nostr: JSON.stringify(signedZapRequest),
      })
  );

  return { invoice: data.pr, relays };
};

const extractMentionNpubs = (event: NDKEvent) => {
  return (event.content.match(NPUB_NOSTR_URI_REGEX) ?? []).map((t) =>
    t.replace(/^nostr:/, "")
  );
};

export const convertNpubToHex = (npub: string) => {
  try {
    const { type, data } = nip19.decode(npub.replace(/^nostr:/, ""));

    if (type === "npub" && typeof data === "string") {
      return data;
    } else {
      throw new Error();
    }
  } catch {
    throw new Error("Invalid npub");
  }
};

export const extractMentionPubkeys = (event: NDKEvent) => {
  const npubs = extractMentionNpubs(event);
  const pubkeys: string[] = [];

  npubs.forEach((npub) => {
    try {
      pubkeys.push(convertNpubToHex(npub));
    } catch {
      // fail silently
    }
  });

  return pubkeys;
};

interface CreateEventTemplateParams {
  ndk: NDK;
  kind: NDKKind;
  content?: string;
  tags?: NDKTag[];
}

export const createEventTemplate = ({
  ndk,
  kind,
  content = "",
  tags,
}: CreateEventTemplateParams) => {
  const eventTemplate = new NDKEvent(ndk);

  eventTemplate.kind = kind;
  eventTemplate.created_at = Math.floor(Date.now() / 1000);
  eventTemplate.content = content;

  if (tags) {
    eventTemplate.tags = tags;
  }

  return eventTemplate;
};

export const createAppDataEventTemplate = ({
  ndk,
  content,
}: {
  ndk: NDK;
  content: string;
}) => {
  const eventTemplate = createEventTemplate({
    ndk,
    kind: NDKKind.AppSpecificData,
    content,
    tags: [["d", "stemstr"]],
  });

  return eventTemplate;
};

export const createRepostEvent = (ndk: NDK, event: NDKEvent): NDKEvent => {
  let created_at = Math.floor(Date.now() / 1000);
  let tags: NDKTag[] = [
    ["e", event.id, process.env.NEXT_PUBLIC_STEMSTR_RELAY as string],
    ["p", event.pubkey],
  ];
  let kind = 6;
  if (event.kind !== Kind.Text) {
    kind = 16;
    tags.push(["k", `${event.kind}`]);
  }
  let repostEvent = new NDKEvent(ndk);
  repostEvent.kind = kind;
  repostEvent.created_at = created_at;
  repostEvent.tags = tags;
  repostEvent.content = JSON.stringify(event.rawEvent());
  return repostEvent;
};

export const createSigner = async (
  authState: AuthState
): Promise<NDKSigner> => {
  if (authState.type === "privatekey") {
    return new NDKPrivateKeySigner(authState.sk);
  }

  if (authState.type === "nip07") {
    const tryToCreateSigner = () => {
      try {
        return new NDKNip07Signer();
      } catch {
        return null;
      }
    };
    let tryCount = 0;
    let signer = tryToCreateSigner();

    if (signer) {
      return signer;
    }

    tryCount += 1;

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const signer = tryToCreateSigner();

        if (signer) {
          resolve(signer);
          clearInterval(interval);
        }

        if (tryCount > 5) {
          reject("Failed to create signer");
          clearInterval(interval);
        }

        tryCount += 1;
      }, 1000);
    });
  }

  throw new Error("Invalid auth state");
};

export const isRootEvent = (event: NDKEvent): boolean => {
  return !event.tags.find((tag) => tag[0] === "e");
};

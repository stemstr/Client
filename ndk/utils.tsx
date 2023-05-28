import { NDKEvent } from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";

interface ParsedEventTags {
  rootId: string | undefined;
  mentionIds: string[];
  replyingToId: string | undefined;
}

export const parseEventTags = (event: NDKEvent) => {
  const result: ParsedEventTags = {
    rootId: "",
    mentionIds: [],
    replyingToId: "",
  };
  const eTags = event.tags.filter((t) => t[0] === "e");
  if (usesDepecratedETagSchema(event)) {
    if (eTags) {
      if (eTags.length === 1) {
        result.replyingToId = eTags[0][1];
      }
      if (eTags.length > 0) {
        result.rootId = eTags[0][1];
      }
      if (eTags.length > 1) {
        console.log(eTags);
        result.replyingToId = eTags[eTags.length - 1][1];
      }
      if (eTags.length > 2) {
        for (let i = 1; i < eTags.length - 1; i++) {
          result.mentionIds.push(eTags[i][1]);
        }
      }
    }
  } else {
    eTags?.forEach((t) => {
      switch (t[3]) {
        case "root":
          result.rootId = t[1];
          break;
        case "reply":
          result.replyingToId = t[1];
          break;
        case "mention":
          result.mentionIds.push(t[1]);
          break;
      }
    });
  }
  return result;
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

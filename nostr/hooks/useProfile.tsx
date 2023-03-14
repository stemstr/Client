import { atom, useAtom } from "jotai";
import { nip19 } from "nostr-tools";
import { useEffect, useState } from "react";

import useNostrEvents from "./useNostrEvents";
import { uniqValues } from "../utils";
import axios from "axios";

export interface Metadata {
  name?: string;
  username?: string;
  display_name?: string;
  picture?: string;
  banner?: string;
  about?: string;
  website?: string;
  lud06?: string;
  lud16?: string;
  nip05?: string;
}

const QUEUE_DEBOUNCE_DURATION = 100;

let timer: NodeJS.Timeout | undefined = undefined;

const queuedPubkeysAtom = atom<string[]>([]);
const requestedPubkeysAtom = atom<string[]>([]);
const fetchedProfilesAtom = atom<Record<string, Metadata>>({});

function useProfileQueue({ pubkey }: { pubkey: string }) {
  const [isReadyToFetch, setIsReadyToFetch] = useState(false);

  const [queuedPubkeys, setQueuedPubkeys] = useAtom(queuedPubkeysAtom);

  const [requestedPubkeys] = useAtom(requestedPubkeysAtom);
  const alreadyRequested = !!requestedPubkeys.includes(pubkey);

  useEffect(() => {
    if (alreadyRequested) {
      return;
    }

    clearTimeout(timer);

    timer = setTimeout(() => {
      setIsReadyToFetch(true);
    }, QUEUE_DEBOUNCE_DURATION);

    setQueuedPubkeys((_pubkeys: string[]) => {
      // Unique values only:
      const arr = [..._pubkeys, pubkey].filter(uniqValues).filter((_pubkey) => {
        return !requestedPubkeys.includes(_pubkey);
      });

      return arr;
    });
  }, [pubkey, setQueuedPubkeys, alreadyRequested, requestedPubkeys]);

  return {
    pubkeysToFetch: isReadyToFetch ? queuedPubkeys : [],
  };
}

export function useProfile({
  pubkey,
  enabled: _enabled = true,
}: {
  pubkey: string;
  enabled?: boolean;
}) {
  const [, setRequestedPubkeys] = useAtom(requestedPubkeysAtom);
  const { pubkeysToFetch } = useProfileQueue({ pubkey });
  const enabled = _enabled && !!pubkeysToFetch.length;

  const [fetchedProfiles, setFetchedProfiles] = useAtom(fetchedProfilesAtom);
  const nip05 = useNIP05(fetchedProfiles[pubkey], pubkey);

  const { onEvent, onSubscribe, isLoading, onDone } = useNostrEvents({
    filter: {
      kinds: [0],
      authors: pubkeysToFetch,
    },
    enabled,
  });

  onSubscribe(() => {
    // Reset list
    // (We've already opened a subscription to these pubkeys now)
    setRequestedPubkeys((_pubkeys) => {
      return [..._pubkeys, ...pubkeysToFetch].filter(uniqValues);
    });
  });

  onEvent((rawMetadata) => {
    try {
      const metadata: Metadata = JSON.parse(rawMetadata.content);
      const metaPubkey = rawMetadata.pubkey;

      if (metadata) {
        setFetchedProfiles((_profiles: Record<string, Metadata>) => {
          return {
            ..._profiles,
            [metaPubkey]: metadata,
          };
        });
      }
    } catch (err) {
      console.error(err, rawMetadata);
    }
  });

  const metadata = fetchedProfiles[pubkey];
  const npub = nip19.npubEncode(pubkey);

  return {
    isLoading,
    onDone,
    data: metadata
      ? {
          ...metadata,
          npub,
        }
      : undefined,
    nip05,
  };
}

export function useNIP05(data: Metadata, pubkey: string) {
  const [nip05, setNIP05] = useState<{ name: string; hostname: string } | null>(
    null
  );

  useEffect(() => {
    if (data?.nip05) {
      const { name, hostname } = parseNIP05(data.nip05);
      axios
        .get(`https://${hostname}/.well-known/nostr.json?name=${name}`)
        .then((response) => {
          if (response.data.names[name] === pubkey) {
            setNIP05({ name, hostname });
          }
        })
        .catch((error) => console.error(error));
    }
  }, [data]);

  return nip05;
}

function parseNIP05(nip05: string): { name: string; hostname: string } {
  const atIndex = nip05.indexOf("@");
  const name = nip05.slice(0, atIndex);
  const hostname = nip05.slice(atIndex + 1);
  return { name, hostname };
}

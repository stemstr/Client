import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useNDK } from "ndk/NDKProvider";
import { getCachedContactList } from "../inMemoryCacheAdapter";
import { useCallback, useEffect, useState } from "react";

export default function useContactList({ pubkey }: { pubkey?: string }) {
  const { ndk } = useNDK();
  const [contactList, setContactList] = useState<NDKEvent | undefined>(
    getCachedContactList(pubkey, ndk)
  );

  useEffect(() => {
    fetchContactList();
  }, [pubkey, ndk]);

  const fetchContactList = useCallback(async () => {
    if (!ndk || !pubkey) return;
    const contactListEvents = await ndk.fetchEvents({
      kinds: [3],
      authors: [pubkey],
    });

    if (contactListEvents.size) {
      const newestEvent = Array.from(contactListEvents).reduce(
        (newestEvent, currentEvent) => {
          if (
            !newestEvent ||
            currentEvent.created_at! > newestEvent.created_at!
          ) {
            return currentEvent;
          }
          return newestEvent;
        }
      );
      setContactList(newestEvent);
    } else {
      const emptyContactList = new NDKEvent();
      emptyContactList.kind = 3;
      emptyContactList.pubkey = pubkey;
      setContactList(emptyContactList);
    }
  }, [pubkey, ndk, setContactList]);

  return { contactList, setContactList };
}

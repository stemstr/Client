import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useNDK } from "ndk/NDKProvider";
import { useCallback, useEffect, useState } from "react";

export default function useContactList({ hexpubkey }: { hexpubkey?: string }) {
  const { ndk } = useNDK();
  const [contactList, setContactList] = useState<NDKEvent>();

  useEffect(() => {
    fetchContactList();
  }, [hexpubkey, ndk]);

  const fetchContactList = useCallback(async () => {
    if (!ndk || !hexpubkey) return;
    const contactListEvents = await ndk.fetchEvents({
      kinds: [3],
      authors: [hexpubkey],
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
    }
  }, [hexpubkey, ndk, setContactList]);

  return { contactList, setContactList };
}

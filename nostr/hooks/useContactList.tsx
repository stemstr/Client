import { Event, Kind } from "nostr-tools";
import { useEffect, useMemo, useState } from "react";
import useNostrEvents from "./useNostrEvents";

export default function useContactList({
  pubkey,
  relayUrls,
}: {
  pubkey: string;
  relayUrls?: string[];
}) {
  const { events } = useNostrEvents({
    filter: {
      kinds: [Kind.Contacts],
      authors: [pubkey],
    },
    relayUrls,
  });
  const [contactList, setContactList] = useState<Event | null>(null);
  const relayList = useMemo(() => {
    try {
      if (contactList?.content) return JSON.parse(contactList?.content);
    } catch (error) {
      console.log(error);
    }
    return {};
  }, [contactList]);

  useEffect(() => {
    setContactList(() => {
      if (!events.length) return null;
      return events.reduce(
        (prev, curr) => (prev?.created_at > curr?.created_at ? prev : curr),
        events[0]
      );
    });
  }, [events]);

  return {
    contactList,
    relayList,
  };
}

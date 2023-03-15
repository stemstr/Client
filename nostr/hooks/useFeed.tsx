import { Filter, Event } from "nostr-tools";
import useNostrEvents from "./useNostrEvents";

export type Note = {
  event: Event;
  replies: Event[];
  reposts: Event[];
  reactions: Event[];
  zaps: Event[];
};

export function useFeed({
  filter,
  relayUrls,
}: {
  filter: Filter;
  relayUrls?: string[];
}) {
  const { events: feed } = useNostrEvents({
    filter,
    relayUrls,
  });

  return {
    feed,
  };
}

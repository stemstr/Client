import { useEffect, useState } from "react";
import { type NDKEvent } from "@nostr-dev-kit/ndk";
import { useNDK } from "../../ndk/NDKProvider";
import { EventProvider } from "../../ndk/NDKEventProvider";
import { FeedNote } from "../Note/Note";
import { Stack } from "@mantine/core";
import useFooterHeight from "../../ndk/hooks/useFooterHeight";

export default function PlaylistFeed({
  d,
  playlistCreatorPubkey,
}: {
  d: string;
  playlistCreatorPubkey: string;
}) {
  const { ndk, stemstrRelaySet } = useNDK();
  const [events, setEvents] = useState<NDKEvent[]>([]);
  const footerHeight = useFooterHeight();

  useEffect(() => {
    if (!ndk) {
      return;
    }

    // for some reason, the query works more consistently providing the author pubkey even though it shouldn't
    // be necessary
    ndk
      .fetchEvent(
        {
          kinds: [30001],
          authors: [playlistCreatorPubkey],
          "#d": [d],
        },
        {}
      )
      .then((event) => {
        if (event) {
          return event.getMatchingTags("e").map((tag) => tag[1]);
        }
      })
      .then(async (eventIds) => {
        if (eventIds) {
          return {
            sortedEventIds: eventIds,
            events: await ndk.fetchEvents(
              { ids: eventIds },
              {},
              stemstrRelaySet
            ),
          };
        }

        return { sortedEventIds: [], events: [] };
      })
      .then(({ sortedEventIds, events }) => {
        if (!events) {
          return;
        }

        const eventsMap: Record<string, NDKEvent> = {};

        events.forEach((event) => {
          eventsMap[event.id] = event;
        });

        setEvents(sortedEventIds.map((id) => eventsMap[id]));
      })
      .catch(console.error);
  }, [d, ndk, stemstrRelaySet, playlistCreatorPubkey]);

  // Not using the Feed component because it causes an infinite loop for some reason
  return (
    <Stack mb={footerHeight + 16}>
      {events.map((event) => (
        <EventProvider key={event.id} event={event}>
          <FeedNote />
        </EventProvider>
      ))}
    </Stack>
  );
}

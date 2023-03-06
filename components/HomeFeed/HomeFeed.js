import { useCallback, useMemo, useRef } from "react";
import { dateToUnix } from "nostr-react";
import useNostrEvents from "../../nostr/hooks/useNostrEvents";
import Note from "../Note/Note";
import { Stack } from "@mantine/core";
import { useSelector } from "react-redux";
import { Kind } from "nostr-tools";

export default function HomeFeed() {
  const eventsCache = useSelector((s) => s.events);
  const filterPosts = useCallback((events) => {
    return events[Kind.Text];
  }, []);
  const homeFeed = useMemo(
    () => filterPosts(eventsCache),
    [eventsCache, filterPosts]
  );
  const startTime = useRef(dateToUnix(new Date()) - 60 * 60 * 1); // Make sure start time isn't re-rendered

  const { events: textEvents } = useNostrEvents({
    filter: {
      since: startTime.current, // all new textEvents from startTime
      kinds: [Kind.Text],
    },
    relayUrls: [process.env.NEXT_PUBLIC_STEMSTR_RELAY],
  });

  const { events: reactionEvents } = useNostrEvents({
    filter: {
      since: startTime.current, // all new textEvents from startTime
      kinds: [Kind.Reaction],
    },
    relayUrls: [process.env.NEXT_PUBLIC_STEMSTR_RELAY],
  });

  return (
    <>
      <Stack>
        {textEvents.map((event) => (
          <Note key={event.id} event={event} reactionEvents={reactionEvents} />
        ))}
      </Stack>
    </>
  );
}

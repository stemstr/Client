import { useEffect, useRef } from "react";
import { useNostrEvents, dateToUnix } from "nostr-react";
import Note from "../Note/Note";
import { Stack } from "@mantine/core";

export default function GlobalFeed() {
  const startTime = useRef(dateToUnix(new Date()) - 60 * 1); // Make sure start time isn't re-rendered

  const { events } = useNostrEvents({
    filter: {
      since: startTime.current, // all new events from startTime
      kinds: [1],
    },
  });

  return (
    <>
      <Stack>
        {events.map((event) => (
          <Note key={event.id} event={event} />
        ))}
        {/* {events.length > 0 ? (
          <Note key={events[events.length - 1].id} event={events[events.length - 1]} />
        ) : null} */}
      </Stack>
    </>
  );
}

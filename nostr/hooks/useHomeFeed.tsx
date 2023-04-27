import { Kind, Event } from "nostr-tools";
import { useMemo, useRef } from "react";
import { dateToUnix, parseEventTags } from "../utils";
import { Note, useFeed } from "./useFeed";

export function useHomeFeed({ relayUrls }: { relayUrls?: string[] }) {
  const startTime = useRef(dateToUnix(new Date()) - 60 * 60 * 24 * 7); // Make sure start time isn't re-rendered
  const { feed } = useFeed({
    filter: {
      since: startTime.current,
      kinds: [Kind.Text, 6, 1808],
    },
    relayUrls: [process.env.NEXT_PUBLIC_STEMSTR_RELAY as string],
  });
  const { feed: related } = useFeed({
    filter: {
      kinds: [Kind.Text, Kind.Reaction, Kind.Zap],
      "#e": feed.map((event) => event.id),
    },
  });
  const notes = useMemo<Note[]>(() => {
    const notes = feed
      .filter((e) => {
        // Filter to only root notes and audio notes
        const { rootId } = parseEventTags(e);
        return !rootId || e.kind === (1808 as Kind);
      })
      .map((event) => {
        const replies = related.filter(
          (ev) =>
            ev.kind === Kind.Text &&
            ev.tags.some((tag) => tag[0] === "e" && tag[1] === event.id)
        );
        const reactions = related.filter(
          (ev) =>
            ev.kind === Kind.Reaction &&
            ev.tags.some((tag) => tag[0] === "e" && tag[1] === event.id)
        );
        const reposts = [] as Event[];
        const zaps = related.filter(
          (ev) =>
            ev.kind === Kind.Zap &&
            ev.tags.some((tag) => tag[0] === "e" && tag[1] === event.id)
        );

        return {
          event,
          replies,
          reposts,
          reactions,
          zaps,
        };
      });

    return notes;
  }, [feed, related]);

  return {
    notes,
  };
}

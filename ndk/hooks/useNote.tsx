import { useEffect, useMemo, useState } from "react";
import { useFeed } from "./useFeed";
import { Kind } from "nostr-tools";
import { Note } from "ndk/types/note";
import { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";

export function useNote({ event }: { event: NDKEvent }) {
  const [note, setNote] = useState<Note>({ event: event, reactions: [] });
  const reactionsFilter = useMemo<NDKFilter>(
    () => ({
      kinds: [Kind.Reaction],
      "#e": [event.id],
    }),
    []
  );
  const reactionEvents = useFeed(reactionsFilter);

  useEffect(() => {
    setNote((note) => ({ ...note, reactions: reactionEvents }));
  }, [reactionEvents.length, setNote]);

  return note;
}

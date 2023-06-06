import { useEffect, useMemo, useState } from "react";
import { useFeed } from "./useFeed";
import { Kind } from "nostr-tools";
import { Note } from "ndk/types/note";
import { NDKFilter } from "@nostr-dev-kit/ndk";
import { useEvent } from "../NDKEventProvider";

export function useNote() {
  const { event } = useEvent();
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

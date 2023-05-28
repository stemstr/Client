import { useEffect, useMemo, useState } from "react";
import { useFeed } from "./useFeed";
import { Kind } from "nostr-tools";
import { Note } from "ndk/types/note";
import { NDKFilter } from "@nostr-dev-kit/ndk";

export function useHomeFeed() {
  const filter = useMemo<NDKFilter>(
    () => ({
      kinds: [1, 1808 as Kind],
      limit: 100,
    }),
    []
  );
  const events = useFeed(filter, [
    process.env.NEXT_PUBLIC_STEMSTR_RELAY as string,
  ]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    setNotes(
      events.map((event) => ({
        event: event,
      }))
    );
  }, [events.length, setNotes]);

  return notes;
}

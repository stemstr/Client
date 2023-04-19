import { Kind, Event } from "nostr-tools";
import { useEffect, useMemo, useRef, useState } from "react";
import { dateToUnix, uniqBy } from "../utils";
import { Note, useFeed } from "./useFeed";

export function useThread({
  noteId,
  relayUrls,
}: {
  noteId: string;
  relayUrls?: string[];
}): { targetNote: Note | null; genesisNote: Note | null; thread: Note[] } {
  const [noteIds, setNoteIds] = useState<string[]>([noteId]);

  const { feed: threadEvents } = useFeed({
    filter: {
      ids: noteIds,
    },
  });

  const { feed: searchEvents } = useFeed({
    filter: {
      kinds: [Kind.Text, 1808],
      "#e": noteIds,
    },
  });

  const thread = useMemo<Note[]>(() => {
    const notes: Note[] = threadEvents.map((event) => {
      const replies: Event[] = [];
      const reactions: Event[] = [];
      const reposts: Event[] = [];
      const zaps: Event[] = [];

      return {
        event,
        replies,
        reposts,
        reactions,
        zaps,
      };
    });

    return notes;
  }, [threadEvents.length]);

  const genesisNote = useMemo<Note | null>(() => {
    const genesisNote =
      thread.find((note) => !note.event.tags.find((tag) => tag[0] === "e")) ||
      null;
    return genesisNote;
  }, [thread.length]);

  const targetNote = useMemo<Note | null>(() => {
    const targetNote = thread.find((note) => note.event.id === noteId) || null;
    return targetNote;
  }, [thread.length]);

  useEffect(() => {
    const threadIds = threadEvents.map((event) => event.id);
    const searchIds = searchEvents.map((event) => event.id);
    setNoteIds((prevNoteIds) => [
      ...new Set([...prevNoteIds, ...threadIds, ...searchIds]),
    ]);
    // console.log(threadEvents);
  }, [threadEvents.length, searchEvents.length]);

  return {
    targetNote,
    genesisNote,
    thread,
  };
}

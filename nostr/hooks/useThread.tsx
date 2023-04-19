import { Kind, Event } from "nostr-tools";
import { useEffect, useMemo, useRef, useState } from "react";
import { dateToUnix, uniqBy } from "../utils";
import { Note, useFeed } from "./useFeed";

interface NoteTreeNode extends Note {
  children: NoteTreeNode[];
}

export function useThread({
  noteId,
  relayUrls,
}: {
  noteId: string;
  relayUrls?: string[];
}): {
  targetNote: Note | null;
  genesisNote: Note | null;
  thread: NoteTreeNode | null;
  targetThread: NoteTreeNode | null;
} {
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

  const threadNotes = useMemo<Note[]>(() => {
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
      threadNotes.find(
        (note) => !note.event.tags.find((tag) => tag[0] === "e")
      ) || null;
    return genesisNote;
  }, [threadNotes.length]);

  const targetNote = useMemo<Note | null>(() => {
    const targetNote =
      threadNotes.find((note) => note.event.id === noteId) || null;
    return targetNote;
  }, [threadNotes.length]);

  const thread = useMemo<NoteTreeNode | null>(
    () => buildTree(threadNotes),
    [threadNotes.length]
  );

  const targetThread = useMemo<NoteTreeNode | null>(
    () => (thread ? findNodeById(thread, noteId) : null),
    [thread]
  );

  useEffect(() => {
    const threadIds = threadEvents
      .map((event) => event.tags.filter((t) => t[0] === "e").map((t) => t[1]))
      .flat(); // TODO: change to tags
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
    targetThread,
  };
}

function buildTree(notes: Note[]): NoteTreeNode | null {
  const noteMap = new Map<string, NoteTreeNode>();

  notes.forEach((note) => {
    noteMap.set(note.event.id, { ...note, children: [] });
  });

  let rootNode: NoteTreeNode | null = null;

  function sortChildrenByCreatedAt(node: NoteTreeNode): void {
    node.children.sort((a, b) => a.event.created_at - b.event.created_at);
    node.children.forEach((child) => sortChildrenByCreatedAt(child));
  }

  noteMap.forEach((node, nodeId) => {
    const parentEventTag = node.event.tags
      .filter((tag) => tag[0] === "e")
      .pop();
    const parentEventId = parentEventTag ? parentEventTag[1] : undefined;
    if (parentEventId === undefined) {
      rootNode = node;
    } else {
      const parentNode = noteMap.get(parentEventId);
      if (parentNode) {
        parentNode.children.push(node);
      }
    }
  });

  if (rootNode) {
    sortChildrenByCreatedAt(rootNode);
  }

  return rootNode;
}

function findNodeById(
  treeNode: NoteTreeNode | null,
  id: string
): NoteTreeNode | null {
  if (treeNode === null) {
    return null;
  }

  if (treeNode.event.id === id) {
    return treeNode;
  }

  for (const child of treeNode.children) {
    const foundNode = findNodeById(child, id);
    if (foundNode !== null) {
      return foundNode;
    }
  }

  return null;
}

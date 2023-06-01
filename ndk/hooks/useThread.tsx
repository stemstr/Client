import { useEffect, useMemo, useState } from "react";
import { useFeed } from "./useFeed";
import { Kind } from "nostr-tools";
import { useNDK } from "ndk/NDKProvider";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { parseEventTags, usesDepecratedETagSchema } from "ndk/utils";
import { Note, NoteTreeNode } from "ndk/types/note";

export function useThread({ noteId }: { noteId: string }) {
  const { ndk } = useNDK();
  const [targetEvent, setTargetEvent] = useState<NDKEvent | null>(null);
  const [rootEvent, setRootEvent] = useState<NDKEvent | null>(null);
  const filter = useMemo(
    () => ({ kinds: [1, 1808 as Kind], "#e": [rootEvent ? rootEvent.id : ""] }),
    [rootEvent?.id]
  );
  const events = useFeed(filter);
  const [notes, setNotes] = useState<Note[]>([]);
  const [thread, setThread] = useState<NoteTreeNode | null>(null);

  useEffect(() => {
    if (ndk) {
      ndk.fetchEvent({ ids: [noteId] }).then((note: NDKEvent | null) => {
        setTargetEvent(note);
      });
    }
  }, [noteId, setTargetEvent]);

  useEffect(() => {
    if (ndk) {
      if (targetEvent) {
        const { root } = parseEventTags(targetEvent);
        if (root) {
          ndk.fetchEvent({ ids: [root[1]] }).then((note: NDKEvent | null) => {
            setRootEvent(note);
          });
        } else {
          setRootEvent(targetEvent);
        }
      }
    }
  }, [targetEvent, setRootEvent]);

  useEffect(() => {
    const notes: Note[] = [];
    let threadEvents = [...events];
    if (rootEvent) threadEvents = [rootEvent, ...threadEvents];
    threadEvents.forEach((event) => {
      notes.push({
        event: event,
        reactions: [],
      });
    });
    setNotes(notes);
  }, [events.length, rootEvent, setNotes]);

  useEffect(() => {
    setThread(buildTree(notes, rootEvent?.id));
  }, [notes.length, setThread]);

  return { thread, targetEvent };
}

function buildTree(
  notes: Note[],
  rootEventId: string | undefined
): NoteTreeNode | null {
  const noteMap = new Map<string, NoteTreeNode>();

  notes.forEach((note) => {
    noteMap.set(note.event.id, { note: note, children: [] });
  });

  let rootNode: NoteTreeNode | null = null;

  function sortChildrenByCreatedAt(node: NoteTreeNode): void {
    node.children.sort(
      (a, b) =>
        (a.note.event.created_at as number) -
        (b.note.event.created_at as number)
    );
    node.children.forEach((child) => sortChildrenByCreatedAt(child));
  }
  let parentEventTag = null;
  noteMap.forEach((node, nodeId) => {
    if (usesDepecratedETagSchema(node.note.event)) {
      parentEventTag = node.note.event.tags
        .filter((tag) => tag[0] === "e")
        .pop();
    } else {
      parentEventTag = node.note.event.tags.find((tag) => tag[3] === "reply");
      if (!parentEventTag) {
        parentEventTag = node.note.event.tags.find((tag) => tag[3] === "root");
      }
    }
    const parentEventId = parentEventTag ? parentEventTag[1] : undefined;
    if (rootEventId === node.note.event.id) {
      rootNode = node;
    } else if (parentEventId) {
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
  noteTreeNode: NoteTreeNode | null,
  id: string
): NoteTreeNode | null {
  if (noteTreeNode === null) {
    return null;
  }

  if (noteTreeNode.note.event.id === id) {
    return noteTreeNode;
  }

  for (const child of noteTreeNode.children) {
    const foundNode = findNodeById(child, id);
    if (foundNode !== null) {
      return foundNode;
    }
  }

  return null;
}

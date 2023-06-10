import { useEffect, useState } from "react";
import { useNDK } from "ndk/NDKProvider";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { parseEventTags, usesDepecratedETagSchema } from "ndk/utils";
import { NoteTreeNode } from "ndk/types/note";
import { useEventReplies } from "./useEventReplies";

export function useThread({ noteId }: { noteId: string }) {
  const { ndk } = useNDK();
  const [targetEvent, setTargetEvent] = useState<NDKEvent | null>(null);
  const [rootEvent, setRootEvent] = useState<NDKEvent | null>(null);
  const events = useEventReplies(rootEvent);
  const [threadEvents, setThreadEvents] = useState<NDKEvent[]>([]);
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
    let newThreadEvents = [...events];
    if (rootEvent) newThreadEvents = [rootEvent, ...newThreadEvents];
    setThreadEvents(newThreadEvents);
  }, [events.length, rootEvent]);

  useEffect(() => {
    setThread(buildTree(threadEvents, rootEvent?.id));
  }, [threadEvents.length, rootEvent, setThread]);

  return { thread, targetEvent };
}

function buildTree(
  events: NDKEvent[],
  rootEventId: string | undefined
): NoteTreeNode | null {
  const eventMap = new Map<string, NoteTreeNode>();

  events.forEach((event) => {
    eventMap.set(event.id, { event: event, children: [] });
  });

  let rootNode: NoteTreeNode | null = null;

  function sortChildrenByCreatedAt(node: NoteTreeNode): void {
    node.children.sort(
      (a, b) => (a.event.created_at as number) - (b.event.created_at as number)
    );
    node.children.forEach((child) => sortChildrenByCreatedAt(child));
  }
  let parentEventTag = null;
  eventMap.forEach((node, nodeId) => {
    if (usesDepecratedETagSchema(node.event)) {
      parentEventTag = node.event.tags.filter((tag) => tag[0] === "e").pop();
    } else {
      parentEventTag = node.event.tags.find((tag) => tag[3] === "reply");
      if (!parentEventTag) {
        parentEventTag = node.event.tags.find((tag) => tag[3] === "root");
      }
    }
    const parentEventId = parentEventTag ? parentEventTag[1] : undefined;
    if (rootEventId === node.event.id) {
      rootNode = node;
    } else if (parentEventId) {
      const parentNode = eventMap.get(parentEventId);
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

  if (noteTreeNode.event.id === id) {
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

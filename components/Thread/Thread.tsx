import { Box } from "@mantine/core";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import Note from "components/Note/Note";
import { EventProvider } from "ndk/NDKEventProvider";
import { useThread } from "ndk/hooks/useThread";
import { NoteTreeNode } from "ndk/types/note";
import { getNoteIds, usesDepecratedETagSchema } from "ndk/utils";
import { useMemo } from "react";

type ThreadProps = {
  noteId: string;
};

export default function Thread({ noteId }: ThreadProps) {
  const { hex } = useMemo(() => getNoteIds(noteId as string), [noteId]);
  const { thread, targetEvent } = useThread({
    noteId: hex,
  });
  return (
    <>
      {thread && targetEvent && (
        <NoteTree noteTreeNode={thread} targetEvent={targetEvent} />
      )}
    </>
  );
}

type NoteTreeNodeType = "parent" | "focus" | "child" | null;

const NoteTree = ({
  noteTreeNode,
  targetEvent,
  nodeDepth = 0,
  type = "parent",
}: {
  noteTreeNode: NoteTreeNode;
  targetEvent: NDKEvent;
  nodeDepth?: number;
  type?: NoteTreeNodeType;
}) => {
  if (!noteTreeNode || !type) return null;

  if (type === "parent" && noteTreeNode.event.id === targetEvent?.id)
    type = "focus";

  if (type === "focus" && noteTreeNode.event.id !== targetEvent?.id)
    return null;

  const childType = useMemo(() => {
    let childType: NoteTreeNodeType = "parent";
    if (type === "child") childType = null;
    if (type === "focus") childType = "child";
    if (
      noteTreeNode.children.find(
        (childNode) => childNode.event.id === targetEvent?.id
      )
    )
      childType = "focus";
    return childType;
  }, [noteTreeNode.children.length, type, targetEvent?.id]);

  if (
    type === "parent" &&
    !isAncestorOf(noteTreeNode, targetEvent) &&
    nodeDepth !== 0
  )
    return null;

  return (
    <>
      <Box
        sx={(theme) => ({
          backgroundColor:
            nodeDepth === 0 || type === "focus"
              ? theme.colors.dark[8]
              : undefined,
          padding: theme.spacing.md,
          borderBottom:
            type === "child" ? `1px solid ${theme.colors.gray[4]}` : undefined,
          transition: "background-color .5s ease",
          "&:hover": {
            backgroundColor: theme.colors.gray[6],
          },
        })}
      >
        <EventProvider event={noteTreeNode.event}>
          <Note key={noteTreeNode.event.id} type={type} />
        </EventProvider>
      </Box>
      {noteTreeNode.children.map((childNode) => (
        <NoteTree
          key={childNode.event.id}
          noteTreeNode={childNode}
          targetEvent={targetEvent}
          nodeDepth={nodeDepth + 1}
          type={childType}
        />
      ))}
    </>
  );
};

function isAncestorOf(ancestorNode: NoteTreeNode, targetEvent: NDKEvent) {
  if (!ancestorNode || !targetEvent || !ancestorNode.children) {
    return false;
  }

  let parentEventTag = null;
  if (usesDepecratedETagSchema(targetEvent)) {
    parentEventTag = targetEvent.tags.filter((t) => t[0] === "e").pop();
  } else {
    parentEventTag = targetEvent.tags.find(
      (t) => t[0] === "e" && t[3] === "reply"
    );
  }
  const parentEventId = parentEventTag ? parentEventTag[1] : undefined;

  if (parentEventId === ancestorNode.event.id) {
    return true;
  }

  for (const childNode of ancestorNode.children) {
    if (isAncestorOf(childNode, targetEvent)) {
      return true;
    }
  }

  return false;
}

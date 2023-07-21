import React, { useMemo } from "react";
import { Box, Group, Text } from "@mantine/core";
import { useRouter } from "next/router";
import BackButton from "../../components/BackButton/BackButton";
import Note from "../../components/Note/Note";
import { ChevronLeftIcon } from "../../icons/StemstrIcon";
import { getNoteIds, usesDepecratedETagSchema } from "../../ndk/utils";
import { useThread } from "../../ndk/hooks/useThread";
import { NoteTreeNode } from "../../ndk/types/note";
import { Route } from "../../enums/routes";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { EventProvider } from "../../ndk/NDKEventProvider";

export default function ThreadPage() {
  const router = useRouter();
  const { noteId } = router.query;
  const { hex, bech32 } = useMemo(() => getNoteIds(noteId as string), [noteId]);
  const { thread, targetEvent } = useThread({
    noteId: hex,
  });

  return (
    <>
      <Group position="left" p="md" bg="dark.8">
        <Group spacing="sm" align="center" c="white">
          <BackButton defaultUrl={Route.Discover}>
            <ChevronLeftIcon width={24} height={24} />
          </BackButton>
          <Text c="white" fw="bold" fz={24} lh="normal">
            Replies
          </Text>
        </Group>
      </Group>
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

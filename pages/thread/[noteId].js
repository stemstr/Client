import { Box, Group, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useMemo } from "react";
import BackButton from "../../components/BackButton/BackButton";
import Note from "../../components/Note/Note";
import { ChevronLeftIcon } from "../../icons/StemstrIcon";
import { getNoteIds, usesDepecratedETagSchema } from "../../nostr/utils";
import { useThread } from "../../nostr";
import { Route } from "../../enums/routes";

export default function ThreadPage() {
  const router = useRouter();
  const { noteId } = router.query;
  const { hex, bech32 } = useMemo(() => getNoteIds(noteId), [noteId]);
  const { targetNote, thread } = useThread({
    noteId: hex,
  });

  return (
    <>
      <Group position="left" p="md" bg="dark.8">
        <Group spacing="sm" align="center" c="white">
          <BackButton url={Route.Home}>
            <ChevronLeftIcon width={24} height={24} />
          </BackButton>
          <Text c="white" fw="bold" fz={24} lh="normal">
            Replies
          </Text>
        </Group>
      </Group>
      {thread && <NoteTree noteTreeNode={thread} targetNote={targetNote} />}
    </>
  );
}

const NoteTree = ({
  noteTreeNode,
  targetNote,
  nodeDepth = 0,
  type = "parent",
}) => {
  if (!noteTreeNode || !type) return null;

  if (type === "parent" && noteTreeNode.event.id === targetNote?.event.id)
    type = "focus";

  if (type === "focus" && noteTreeNode.event.id !== targetNote?.event.id)
    return null;

  const childType = useMemo(() => {
    let childType = "parent";
    if (type === "child") childType = null;
    if (type === "focus") childType = "child";
    if (
      noteTreeNode.children.find(
        (childNode) => childNode.event.id === targetNote?.event.id
      )
    )
      childType = "focus";
    return childType;
  }, [noteTreeNode.children.length, type, targetNote?.event.id]);

  if (
    type === "parent" &&
    !isAncestorOf(noteTreeNode, targetNote) &&
    nodeDepth !== 0
  )
    return null;

  return (
    <>
      <Box
        sx={(theme) => ({
          backgroundColor:
            (nodeDepth === 0 || type === "focus") && theme.colors.dark[8],
          padding: theme.spacing.md,
          borderBottom:
            type === "child" ? `1px solid ${theme.colors.gray[4]}` : undefined,
        })}
      >
        <Note key={noteTreeNode.event.id} note={noteTreeNode} type={type} />
      </Box>
      {noteTreeNode.children.map((childNode) => (
        <NoteTree
          key={childNode.event.id}
          noteTreeNode={childNode}
          targetNote={targetNote}
          nodeDepth={nodeDepth + 1}
          type={childType}
        />
      ))}
    </>
  );
};

function isAncestorOf(ancestorNode, targetNode) {
  if (!ancestorNode || !targetNode || !ancestorNode.children) {
    return false;
  }

  let parentEventTag = null;
  if (usesDepecratedETagSchema(targetNode.event)) {
    parentEventTag = targetNode.event.tags.filter((t) => t[0] === "e").pop();
  } else {
    parentEventTag = targetNode.event.tags.find(
      (t) => t[0] === "e" && t[3] === "reply"
    );
  }
  const parentEventId = parentEventTag ? parentEventTag[1] : undefined;

  if (parentEventId === ancestorNode.event.id) {
    return true;
  }

  for (const childNode of ancestorNode.children) {
    if (isAncestorOf(childNode, targetNode)) {
      return true;
    }
  }

  return false;
}

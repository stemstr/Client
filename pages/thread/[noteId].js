import { Box, Group, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import BackButton from "../../components/BackButton/BackButton";
import Note from "../../components/Note/Note";
import { ChevronLeftIcon } from "../../icons/StemstrIcon";
import { getNoteIds } from "../../nostr/utils";
import { useThread } from "../../nostr";

export default function ThreadPage() {
  const router = useRouter();
  const { noteId } = router.query;
  const { hex, bech32 } = useMemo(() => getNoteIds(noteId), [noteId]);
  const { targetNote, genesisNote, thread, targetThread } = useThread({
    noteId: hex,
  });

  useEffect(() => {
    console.log(targetThread);
  }, [targetThread]);

  return (
    <>
      <Group position="left" p="md">
        <Group spacing="sm" align="center" c="white">
          <BackButton defaultUrl="/">
            <ChevronLeftIcon width={24} height={24} />
          </BackButton>
          <Text c="white" fw="bold" fz={24} lh="normal">
            Thread
          </Text>
        </Group>
      </Group>
      {targetThread && <NoteTree noteTreeNode={targetThread} />}
    </>
  );
}

const NoteTree = ({ noteTreeNode }) => {
  if (!noteTreeNode) return null;

  return (
    <>
      <Note key={noteTreeNode.event.id} note={noteTreeNode} />
      {noteTreeNode.children.map((childNode) => (
        <NoteTree key={childNode.event.id} noteTreeNode={childNode} />
      ))}
    </>
  );
};

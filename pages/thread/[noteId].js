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
  const { targetNote, genesisNote, thread } = useThread({ noteId: hex });

  useEffect(() => {
    // console.log(thread);
  }, [thread.length]);

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
      {targetNote && <Note key={targetNote.id} note={targetNote} />}
      {thread.map(
        (note) =>
          note.event.id !== targetNote.event.id && (
            <Note key={note.event.id} note={note} />
          )
      )}
    </>
  );
}

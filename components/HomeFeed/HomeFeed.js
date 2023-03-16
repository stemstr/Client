import Note from "../Note/Note";
import { Stack } from "@mantine/core";
import { useHomeFeed } from "../../nostr/hooks/useHomeFeed";

export default function HomeFeed() {
  const { notes } = useHomeFeed({});

  return (
    <>
      <Stack>
        {notes.map((note) => (
          <Note key={note.event.id} note={note} />
        ))}
      </Stack>
    </>
  );
}

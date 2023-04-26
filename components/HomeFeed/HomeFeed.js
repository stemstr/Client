import { FeedNote } from "../Note/Note";
import { ScrollArea, Stack } from "@mantine/core";
import { useHomeFeed } from "../../nostr/hooks/useHomeFeed";

export default function HomeFeed() {
  const { notes } = useHomeFeed({});

  return (
    <Stack>
      {notes.map((note) => (
        <FeedNote key={note.event.id} note={note} />
      ))}
    </Stack>
  );
}

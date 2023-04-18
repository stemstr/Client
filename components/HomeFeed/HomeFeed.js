import Note from "../Note/Note";
import { ScrollArea, Stack } from "@mantine/core";
import { useHomeFeed } from "../../nostr/hooks/useHomeFeed";

export default function HomeFeed() {
  const { notes } = useHomeFeed({});

  return (
    <ScrollArea type="never" sx={{ height: "100%" }}>
      <Stack>
        {notes.map((note) => (
          <Note key={note.event.id} note={note} />
        ))}
      </Stack>
    </ScrollArea>
  );
}

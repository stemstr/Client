import { Stack } from "@mantine/core";
import { FeedNote } from "../Note/Note";
import { useProfileFeed } from "../../nostr/hooks/useProfileFeed";

export default function ProfileFeed({ pubkey }) {
  const { notes } = useProfileFeed({
    pubkey,
  });

  return notes.length > 0 ? (
    <Stack>
      {notes.map((note) => (
        <FeedNote key={note.event.id} note={note} />
      ))}
    </Stack>
  ) : (
    <></>
  );
}

import { Stack } from "@mantine/core";
import { FeedNote } from "../Note/Note";
import { useProfileFeed } from "ndk/hooks/useProfileFeed";

export default function ProfileFeed({ pubkey }) {
  const feed = useProfileFeed({
    pubkey,
  });

  return feed.length > 0 ? (
    <Stack>
      {feed
        .filter((note) => !note.event.tags.find((tag) => tag[0] === "e"))
        .map((note) => (
          <FeedNote key={note.event.id} note={note} />
        ))}
    </Stack>
  ) : (
    <></>
  );
}

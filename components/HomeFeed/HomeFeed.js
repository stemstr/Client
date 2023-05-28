import { FeedNote } from "../Note/Note";
import { Stack } from "@mantine/core";
import { useHomeFeed } from "ndk/hooks/useHomeFeed";

export default function HomeFeed() {
  const feed = useHomeFeed();

  return (
    <Stack>
      {feed
        .filter((note) => !note.event.tags.find((tag) => tag[0] === "e"))
        .map((note) => (
          <FeedNote key={note.event.id} note={note} />
        ))}
    </Stack>
  );
}

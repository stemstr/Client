import { FeedNote } from "../Note/Note";
import { Stack } from "@mantine/core";
import { useHomeFeed } from "ndk/hooks/useHomeFeed";

export default function HomeFeed() {
  const feed = useHomeFeed();

  return (
    <Stack>
      {feed
        .filter((event) => !event.tags.find((tag) => tag[0] === "e"))
        .map((event) => (
          <FeedNote key={event.id} event={event} />
        ))}
    </Stack>
  );
}

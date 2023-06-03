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
        .filter((event) => !event.tags.find((tag) => tag[0] === "e"))
        .map((event) => (
          <FeedNote key={event.id} event={event} />
        ))}
    </Stack>
  ) : (
    <></>
  );
}

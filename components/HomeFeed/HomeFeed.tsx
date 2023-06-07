import { useHomeFeed } from "ndk/hooks/useHomeFeed";
import Feed from "../Feed/Feed";

export default function HomeFeed() {
  const feed = useHomeFeed();
  const events = feed.filter(
    (event) => !event.tags.find((tag) => tag[0] === "e")
  );

  return <Feed events={events} />;
}

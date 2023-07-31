import { Feed } from "../Feed";
import { NDKEvent, type NDKFilter } from "@nostr-dev-kit/ndk";
import { Kind } from "nostr-tools";

const isRootEvent = (event: NDKEvent): boolean => {
  return !event.tags.find((tag) => tag[0] === "e");
};

const isTagFeedEvent = (event: NDKEvent): boolean => {
  switch (event.kind) {
    case Kind.Text:
      return isRootEvent(event);
    case 6:
      return true;
    case 16:
      return true;
    case 1808:
      return true;
    default:
      return false;
  }
};

export default function TagFeed({ tag }: { tag: string }) {
  const filter: NDKFilter = {
    kinds: [1, 6, 16 as Kind, 1808 as Kind],
    "#t": [tag],
    limit: 50,
  };

  return <Feed filter={filter} feedFilter={isTagFeedEvent} />;
}

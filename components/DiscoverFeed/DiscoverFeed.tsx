import { Feed } from "../Feed";
import { NDKEvent, type NDKFilter } from "@nostr-dev-kit/ndk";
import { isRootEvent } from "ndk/utils";
import { Kind } from "nostr-tools";

const filter: NDKFilter = {
  kinds: [1, 6, 16 as Kind, 1808 as Kind],
  limit: 50,
};

const isDiscoverFeedEvent = (event: NDKEvent): boolean => {
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

export default function DiscoverFeed() {
  return <Feed filter={filter} feedFilter={isDiscoverFeedEvent} />;
}

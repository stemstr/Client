import { Feed } from "../Feed";
import { type NDKFilter } from "@nostr-dev-kit/ndk";
import { Kind } from "nostr-tools";

export default function DiscoverFeed() {
  const filter: NDKFilter = { kinds: [1, 1808 as Kind], limit: 50 };

  return <Feed filter={filter} />;
}

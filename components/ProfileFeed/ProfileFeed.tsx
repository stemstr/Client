import { NDKFilter } from "@nostr-dev-kit/ndk";
import { Kind } from "nostr-tools";
import { Feed } from "components/Feed";

export default function ProfileFeed({ pubkey }: { pubkey: string }) {
  const filter: NDKFilter = {
    kinds: [1, 6, 16 as Kind, 1808 as Kind],
    limit: 50,
    authors: [pubkey],
  };

  return <Feed filter={filter} />;
}

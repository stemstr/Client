import { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
import { Kind } from "nostr-tools";
import { Feed } from "components/Feed";
import { isRootEvent } from "ndk/utils";

export default function ProfileFeed({ pubkey }: { pubkey: string }) {
  const filter: NDKFilter = {
    kinds: [1, 6, 16 as Kind, 1808 as Kind],
    limit: 50,
    authors: [pubkey],
  };

  const isProfileEvent = (event: NDKEvent): boolean => {
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

  return <Feed filter={filter} feedFilter={isProfileEvent} />;
}

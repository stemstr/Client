import { useMemo, useState } from "react";
import DiscoverFeedChips from "components/DiscoverFeedChips/DiscoverFeedChips";
import { Feed, MaxWidthContainer } from "../Feed";
import { type NDKEvent, type NDKFilter } from "@nostr-dev-kit/ndk";
import { Kind } from "nostr-tools";

export default function DiscoverFeed() {
  const chipsHeight = 68;
  const [selectedChip, setSelectedChip] = useState("");
  const [events, setEvents] = useState<NDKEvent[]>([]);
  const filter = useMemo<NDKFilter>(() => {
    const filter: NDKFilter = { kinds: [1, 1808 as Kind], limit: 50 };
    if (selectedChip) filter["#t"] = [selectedChip];
    return filter;
  }, [selectedChip]);

  return (
    <>
      <MaxWidthContainer>
        <DiscoverFeedChips
          events={events}
          value={selectedChip}
          onChange={(newValue) => setSelectedChip(newValue as string)}
        />
      </MaxWidthContainer>
      <Feed
        filter={filter}
        heightOffset={chipsHeight}
        onEventsLoaded={setEvents}
      />
    </>
  );
}

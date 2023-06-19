import { useMemo, useState, useCallback } from "react";
import DiscoverFeedChips from "components/DiscoverFeedChips/DiscoverFeedChips";
import { Feed, MaxWidthContainer } from "../Feed";
import { type NDKEvent, type NDKFilter } from "@nostr-dev-kit/ndk";
import { Kind } from "nostr-tools";

export default function DiscoverFeed() {
  const chipsHeight = 68;
  const [selectedChip, setSelectedChip] = useState("");
  const [chipLabels, setChipLabels] = useState<string[]>([]);
  const chipLabelsHash = chipLabels.join();
  const filter = useMemo<NDKFilter>(
    () => ({
      kinds: [1, 1808 as Kind],
      limit: 100,
      "#t": selectedChip ? [selectedChip] : undefined,
    }),
    [selectedChip]
  );
  const handleOnEventsLoaded = useCallback(
    (events: NDKEvent[]) => {
      const tagNames: string[] = [];

      events.forEach(({ tags }) => {
        tags.forEach((tag) => {
          if (tag[0] === "t") {
            tagNames.push(tag[1]);
          }
        });
      });

      setChipLabels(Array.from(new Set([...chipLabels, ...tagNames])));
    },
    [chipLabelsHash]
  );

  return (
    <>
      <MaxWidthContainer>
        <DiscoverFeedChips
          labels={chipLabels}
          value={selectedChip}
          onChange={(newValue) => setSelectedChip(newValue as string)}
        />
      </MaxWidthContainer>
      <Feed
        filter={filter}
        heightOffset={chipsHeight}
        onEventsLoaded={handleOnEventsLoaded}
      />
    </>
  );
}

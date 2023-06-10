import { useState } from "react";
import DiscoverFeedChips from "components/DiscoverFeedChips/DiscoverFeedChips";
import { useDiscoverFeed } from "ndk/hooks/useDiscoverFeed";
import { Feed, MaxWidthContainer } from "../Feed";

export default function DiscoverFeed() {
  const chipsHeight = 68;
  const [selectedChip, setSelectedChip] = useState("");
  const feed = useDiscoverFeed({
    tags: selectedChip ? [selectedChip] : undefined,
  });
  const events = feed
    .filter((event) => !event.tags.find((tag) => tag[0] === "e"))
    .filter(
      (event) =>
        !selectedChip || event.tags.some((tag) => tag[1] === selectedChip)
    );

  return (
    <>
      <MaxWidthContainer>
        <DiscoverFeedChips
          events={feed}
          value={selectedChip}
          onChange={(newValue) => setSelectedChip(newValue as string)}
        />
      </MaxWidthContainer>
      <Feed events={events} heightOffset={chipsHeight} />
    </>
  );
}

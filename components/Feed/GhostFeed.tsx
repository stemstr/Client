import { useState, useEffect, useRef } from "react";
import { Skeleton, Stack } from "@mantine/core";
import { MaxWidthContainer } from "./MaxWidthContainer";

export const GhostFeed = ({
  headerHeight,
  headerOffset,
}: {
  headerHeight: number;
  headerOffset: number;
}) => {
  const [numOfGhostElements, setNumberOfGhostElement] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const ghostNoteHeight = 200;

  useEffect(() => {
    if (containerRef.current) {
      setNumberOfGhostElement(
        Math.floor(containerRef.current.clientHeight / ghostNoteHeight) || 1
      );
    }
  }, []);

  return (
    <MaxWidthContainer>
      <Stack
        ref={containerRef}
        h={`calc(100vh - ${headerHeight}px - ${headerOffset}px)`}
      >
        {Array.from({ length: numOfGhostElements }).map((_, index) => (
          <Skeleton key={index} height={ghostNoteHeight} radius={16} />
        ))}
      </Stack>
    </MaxWidthContainer>
  );
};

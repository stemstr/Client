import { useRef, useEffect, memo } from "react";
import { FeedNote } from "../Note/Note";
import { useHomeFeed } from "ndk/hooks/useHomeFeed";
import { VariableSizeList, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Box } from "@mantine/core";

export default function DiscoverFeed() {
  const headerHeight = 68;
  const feed = useHomeFeed();
  const events = feed.filter(
    (event) => !event.tags.find((tag) => tag[0] === "e")
  );
  const listRef = useRef<VariableSizeList>(null);
  const rowHeights = useRef<number[]>([]);
  const getRowHeight = (index: number) => rowHeights.current[index] || 200;
  const setRowHeight = (index: number, height: number) => {
    listRef.current?.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: height };
  };
  const Row = memo(
    ({ index, style }: { index: number; style: Record<string, any> }) => {
      const rowRef = useRef<HTMLDivElement>(null);
      const event = events[index];
      const gapSize = 16;
      const topPosition = style.top + gapSize * index;
      const isLastEvent = index === events.length - 1;

      useEffect(() => {
        if (rowRef.current) {
          setRowHeight(index, rowRef.current.clientHeight);
        }
      }, [rowRef]);

      return (
        <Box
          m="auto"
          pl="md"
          pr="md"
          sx={{
            ...style,
            top: topPosition,
            right: 0,
            maxWidth: 600,
          }}
        >
          <div
            ref={rowRef}
            style={{ paddingBottom: isLastEvent ? gapSize : 0 }}
          >
            <FeedNote key={event.id} event={event} />
          </div>
        </Box>
      );
    },
    areEqual
  );

  return (
    <AutoSizer style={{ height: `calc(100vh - ${headerHeight}px` }}>
      {({ height, width }: { height: number; width: number }) => (
        <VariableSizeList
          height={height - 164}
          itemCount={events.length}
          itemSize={getRowHeight}
          width={width}
          overscanCount={10}
          ref={listRef}
        >
          {Row}
        </VariableSizeList>
      )}
    </AutoSizer>
  );
}

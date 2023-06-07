import { useRef, useEffect, memo } from "react";
import { FeedNote } from "../Note/Note";
import { VariableSizeList, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { EventProvider } from "../../ndk/NDKEventProvider";
import { type NDKEvent } from "@nostr-dev-kit/ndk";

interface FeedProps {
  events: NDKEvent[];
  heightOffset?: number;
}

export function Feed({ events, heightOffset = 0 }: FeedProps) {
  const headerHeight = 68;
  const footerHeight = useMediaQuery("(max-width: 480px)") ? 64 : 96;
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
            <EventProvider event={event}>
              <FeedNote key={event.id} />
            </EventProvider>
          </div>
        </Box>
      );
    },
    areEqual
  );

  return (
    <AutoSizer
      style={{ height: `calc(100vh - ${headerHeight}px - ${heightOffset}px` }}
    >
      {({ height, width }: { height: number; width: number }) => (
        <VariableSizeList
          height={height - headerHeight - heightOffset - footerHeight}
          itemCount={events.length}
          itemSize={getRowHeight}
          width={width}
          overscanCount={2}
          ref={listRef}
        >
          {Row}
        </VariableSizeList>
      )}
    </AutoSizer>
  );
}

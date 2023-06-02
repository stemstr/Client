import { useRef, useEffect, memo } from "react";
import { FeedNote } from "../Note/Note";
import { useHomeFeed } from "ndk/hooks/useHomeFeed";
import { VariableSizeList, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Box } from "@mantine/core";

export default function HomeFeed() {
  const headerHeight = 68;
  const feed = useHomeFeed();
  const notes = feed.filter(
    (note) => !note.event.tags.find((tag) => tag[0] === "e")
  );
  const listRef = useRef({});
  const rowHeights = useRef({});
  const getRowHeight = (index) => rowHeights.current[index] || 200;
  const setRowHeight = (index, height) => {
    listRef.current.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: height };
  };
  const Row = memo(({ index, style }) => {
    const rowRef = useRef({});
    const note = notes[index];
    const gapSize = 16;
    const topPosition = style.top + gapSize * index;
    const isLastNote = index === notes.length - 1;

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
        <div ref={rowRef} style={{ paddingBottom: isLastNote ? gapSize : 0 }}>
          <FeedNote key={note.event.id} note={note} />
        </div>
      </Box>
    );
  }, areEqual);

  return (
    <AutoSizer style={{ height: `calc(100vh - ${headerHeight}px` }}>
      {({ height, width }) => (
        <VariableSizeList
          height={height - 164}
          itemCount={notes.length}
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

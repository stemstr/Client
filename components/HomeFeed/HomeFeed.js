import { useRef, useEffect, memo } from "react";
import { FeedNote } from "../Note/Note";
import { useHomeFeed } from "ndk/hooks/useHomeFeed";
import { VariableSizeList, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

export default function HomeFeed() {
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
      <div
        style={{
          ...style,
          top: topPosition,
          width: 568,
          right: 0,
          margin: "auto",
        }}
      >
        <div ref={rowRef} style={{ paddingBottom: isLastNote ? gapSize : 0 }}>
          <FeedNote key={note.event.id} note={note} />
        </div>
      </div>
    );
  }, areEqual);

  return (
    <AutoSizer style={{ height: "100vh" }}>
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

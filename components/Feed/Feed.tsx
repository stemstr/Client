import { useRef, useEffect, memo, useState, useCallback } from "react";
import { FeedNote } from "../Note/Note";
import { VariableSizeList, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { EventProvider } from "../../ndk/NDKEventProvider";
import { type NDKEvent, type NDKFilter } from "@nostr-dev-kit/ndk";
import { useNDK } from "../../ndk/NDKProvider";
import { fetchEvents } from "../../ndk/utils";
import { noop } from "../../utils/common";

interface FeedProps {
  filter: NDKFilter;
  heightOffset?: number;
  onEventsLoaded?: (events: NDKEvent[]) => void;
}

export const Feed = memo(
  ({ filter, heightOffset = 0, onEventsLoaded = noop }: FeedProps) => {
    const { ndk, stemstrRelaySet } = useNDK();
    const [events, setEvents] = useState<NDKEvent[]>([]);
    const hasMoreEvents = useRef(true);
    const isLoadingMore = useRef(false);
    const headerHeight = 68;
    const footerHeight = useMediaQuery("(max-width: 480px)") ? 64 : 96;
    const listRef = useRef<VariableSizeList>(null);
    const rowHeights = useRef<number[]>([]);
    const getRowHeight = (index: number) =>
      rowHeights.current[index] + 16 || 300;
    const setRowHeight = (index: number, height: number) => {
      listRef.current?.resetAfterIndex(0);
      rowHeights.current = { ...rowHeights.current, [index]: height };
    };

    const FeedRow = memo(
      ({ index, style }: { index: number; style: Record<string, any> }) => {
        const rowRef = useRef<HTMLDivElement>(null);
        const event = events[index];

        useEffect(() => {
          if (rowRef.current) {
            setRowHeight(index, rowRef.current.clientHeight);
          }
        }, [index]);

        return (
          <Box
            m="auto"
            pl="md"
            pr="md"
            sx={{
              ...style,
              right: 0,
              maxWidth: 600,
            }}
          >
            <div ref={rowRef}>
              <EventProvider event={event}>
                <FeedNote key={event.id} />
              </EventProvider>
            </div>
          </Box>
        );
      },
      areEqual
    );

    FeedRow.displayName = "FeedRow";

    const processEvents = useCallback(
      (events: NDKEvent[]) => {
        const rootEvents = events.filter(
          (event) => !event.tags.find((tag) => tag[0] === "e")
        );

        setEvents(rootEvents);
        onEventsLoaded(rootEvents);
      },
      [onEventsLoaded]
    );

    // initial load
    useEffect(() => {
      if (!ndk || !stemstrRelaySet) {
        return;
      }

      fetchEvents(filter, ndk, stemstrRelaySet)
        .then((events) => Array.from(events))
        .then(processEvents)
        .catch(console.error);

      return () => {
        hasMoreEvents.current = true;
        setEvents([]);
      };
    }, [ndk, filter, stemstrRelaySet, processEvents]);

    const loadMoreItems = async () => {
      if (!ndk || !stemstrRelaySet || isLoadingMore.current) {
        return;
      }

      isLoadingMore.current = true;

      try {
        const newEvents = await fetchEvents(
          { ...filter, until: events[events.length - 1].created_at },
          ndk,
          stemstrRelaySet
        );

        if (newEvents.size === 0) {
          hasMoreEvents.current = false;
          isLoadingMore.current = false;
          return;
        }

        processEvents([...events, ...newEvents]);
      } catch (error) {
        console.error(error);
      }

      isLoadingMore.current = false;
    };

    return (
      <AutoSizer
        style={{ height: `calc(100vh - ${headerHeight}px - ${heightOffset}px` }}
      >
        {({ height, width }: { height: number; width: number }) => (
          <InfiniteLoader
            isItemLoaded={(index: number) => index < events.length}
            itemCount={
              hasMoreEvents.current ? events.length + 1 : events.length
            }
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <VariableSizeList
                height={height - headerHeight - heightOffset - footerHeight}
                itemKey={(index: number) => events[index].id}
                itemCount={events.length}
                itemSize={getRowHeight}
                width={width}
                overscanCount={10}
                ref={(_ref) => {
                  ref(_ref);
                  // @ts-ignore
                  // TODO: figure out why TS thinks current is immutable
                  listRef.current = _ref;
                }}
                onItemsRendered={onItemsRendered}
              >
                {FeedRow}
              </VariableSizeList>
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    );
  }
);

Feed.displayName = "Feed";

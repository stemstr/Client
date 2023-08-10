import {
  useRef,
  useEffect,
  memo,
  useState,
  useCallback,
  RefObject,
} from "react";
import { FeedNote } from "../Note/Note";
import { ListOnScrollProps, VariableSizeList, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { Box, Transition } from "@mantine/core";
import { EventProvider } from "../../ndk/NDKEventProvider";
import { type NDKEvent, type NDKFilter } from "@nostr-dev-kit/ndk";
import { useNDK } from "../../ndk/NDKProvider";
import { extractMentionPubkeys } from "../../ndk/utils";
import usePreloadProfileCache from "../../ndk/hooks/usePreloadProfileCache";
import { noop } from "../../utils/common";
import useFooterHeight from "../../ndk/hooks/useFooterHeight";
import { NewEventsPill } from "./NewEventsPill";
import { GhostFeed } from "./GhostFeed";
import useStyles from "./Feed.styles";

interface FeedProps {
  filter: NDKFilter;
  feedFilter?: (event: NDKEvent) => boolean;
  heightOffset?: number;
  onEventsLoaded?: (events: NDKEvent[]) => void;
  aboveContentRef?: RefObject<HTMLElement>;
}

const FeedRow = memo(
  ({
    index,
    data,
    style,
  }: {
    index: number;
    data: {
      events: NDKEvent[];
      setRowHeight: (index: number, height: number) => void;
    };
    style: Record<string, any>;
  }) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const event = data.events[index];

    useEffect(() => {
      if (rowRef.current) {
        data.setRowHeight(index, rowRef.current.clientHeight);
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

export const Feed = memo(
  ({
    filter,
    feedFilter = () => true,
    heightOffset = 0,
    onEventsLoaded = noop,
    aboveContentRef,
  }: FeedProps) => {
    const { ndk, stemstrRelaySet } = useNDK();
    const { classes } = useStyles();
    const [events, setEvents] = useState<NDKEvent[]>([]);
    const hasMoreEvents = useRef(true);
    const isLoadingMore = useRef(false);
    const headerHeight = 68;
    const footerHeight = useFooterHeight();
    const listRef = useRef<VariableSizeList>(null);
    const rowHeights = useRef<number[]>([]);
    const getRowHeight = (index: number) =>
      rowHeights.current[index] + 16 || 300;
    const setRowHeight = (index: number, height: number) => {
      listRef.current?.resetAfterIndex(0);
      rowHeights.current = { ...rowHeights.current, [index]: height };
    };

    // only preload the profiles for the first 50 events to reduce amount of data fetched and since relays don't return
    // any results when requesting too many profiles
    const hasAttemptedProfileCachePreload = usePreloadProfileCache(
      events.slice(0, 50).map(({ pubkey }) => pubkey),
      JSON.stringify(filter)
    );

    const processEvents = useCallback(
      (events: NDKEvent[]) => {
        return new Promise<void>((resolve) => {
          const rootEvents = events.filter(feedFilter);
          let mentionedPubkeys: string[] = [];

          rootEvents.forEach((event) => {
            const mentionNpubs = extractMentionPubkeys(event);

            if (mentionNpubs.length > 0) {
              mentionedPubkeys.push(...mentionNpubs);
            }
          });

          if (mentionedPubkeys.length > 0 && ndk) {
            ndk
              .fetchEvents({
                kinds: [0],
                authors: Array.from(new Set(mentionedPubkeys)).slice(0, 50),
              })
              .catch(console.error)
              .finally(() => {
                setEvents(rootEvents);
                onEventsLoaded(rootEvents);
                resolve();
              });
          } else {
            setEvents(rootEvents);
            onEventsLoaded(rootEvents);
            resolve();
          }
        });
      },
      [onEventsLoaded, ndk, feedFilter]
    );

    // initial load
    useEffect(() => {
      if (!ndk || !stemstrRelaySet) {
        return;
      }

      ndk
        .fetchEvents(filter, {}, stemstrRelaySet)
        .then((events) => Array.from(events))
        .then(processEvents)
        .catch(console.error);

      return () => {
        setEvents([]);
        hasMoreEvents.current = true;
      };
    }, [ndk, filter, stemstrRelaySet]);

    const loadMoreItems = async () => {
      if (!ndk || !stemstrRelaySet || isLoadingMore.current) {
        return;
      }

      isLoadingMore.current = true;

      try {
        const newEvents = await ndk.fetchEvents(
          { ...filter, until: events[events.length - 1].created_at },
          {},
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
    const handleNewEventsPillClick = async (
      eventsWaitingToBeRendered: NDKEvent[]
    ) => {
      await processEvents([...eventsWaitingToBeRendered, ...events]);
      listRef.current?.scrollToItem(0);
    };

    const handleScroll = (props: ListOnScrollProps) => {
      if (aboveContentRef?.current) {
        aboveContentRef.current.style.marginTop = `-${Math.min(
          props.scrollOffset,
          aboveContentRef.current.clientHeight
        )}px`;
      }
    };

    return (
      <>
        {!hasAttemptedProfileCachePreload && (
          <GhostFeed headerHeight={headerHeight} headerOffset={heightOffset} />
        )}

        <AutoSizer className={classes.feed}>
          {({ height, width }: { height: number; width: number }) => (
            <Box
              w="100vw"
              sx={{
                position: "relative",
              }}
            >
              {events.length > 0 && (
                <NewEventsPill
                  filter={filter}
                  eventsFilter={feedFilter}
                  since={events[0].created_at! + 1}
                  onClick={handleNewEventsPillClick}
                />
              )}
              <Transition
                transition="slide-up"
                mounted={hasAttemptedProfileCachePreload}
              >
                {(styles) => (
                  <Box style={styles}>
                    <InfiniteLoader
                      isItemLoaded={(index: number) => index < events.length}
                      itemCount={
                        hasMoreEvents.current
                          ? events.length + 1
                          : events.length
                      }
                      loadMoreItems={loadMoreItems}
                      threshold={10}
                    >
                      {({ onItemsRendered, ref }) => (
                        <VariableSizeList
                          onScroll={handleScroll}
                          height={height}
                          itemKey={(index: number) => events[index].id}
                          itemCount={events.length}
                          itemData={{ events, setRowHeight }}
                          itemSize={getRowHeight}
                          width={width}
                          overscanCount={5}
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
                  </Box>
                )}
              </Transition>
            </Box>
          )}
        </AutoSizer>
      </>
    );
  }
);

Feed.displayName = "Feed";

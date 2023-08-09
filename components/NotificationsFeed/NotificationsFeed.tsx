import { Box } from "@mantine/core";
import NotificationView from "components/NotificationView/NotificationView";
import { Notification, useNotifications } from "ndk/NostrNotificationsProvider";
import { useEffect, useRef, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList } from "react-window";
import ResizeObserver from "resize-observer-polyfill";

const NotificationsFeedRow = ({
  index,
  data,
  style,
}: {
  index: number;
  data: {
    notifications: Notification[];
    setRowHeight: (index: number, height: number) => void;
  };
  style: Record<string, any>;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const refreshStyles = () => {
    if (rowRef.current) {
      data.setRowHeight(index, rowRef.current.clientHeight);
    }
  };

  useEffect(() => {
    refreshStyles();
  }, [index]);

  useEffect(() => {
    const observer = new ResizeObserver(refreshStyles);

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Box style={style}>
      <div ref={rowRef}>
        <NotificationView
          key={index}
          notification={data.notifications[index]}
        />
      </div>
    </Box>
  );
};

export default function NotificationsFeed() {
  const { notifications, markAllAsRead } = useNotifications();
  const [sortedNotifications, setSortedNotifications] = useState<
    Notification[]
  >([]);
  const rowHeights = useRef<number[]>([]);
  const listRef = useRef<VariableSizeList>(null);
  const getRowHeight = (index: number) => rowHeights.current[index] + 16 || 300;
  const setRowHeight = (index: number, height: number) => {
    listRef.current?.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: height };
  };

  useEffect(() => {
    setSortedNotifications(
      Array.from(notifications.values()).sort(
        (a, b) => b.created_at - a.created_at
      )
    );
  }, [notifications]);

  useEffect(() => {
    markAllAsRead();
  }, []);

  return (
    <AutoSizer>
      {({ height, width }: { height: number; width: number }) => (
        <Box w={width} h={height}>
          <VariableSizeList
            itemCount={sortedNotifications.length}
            itemData={{
              notifications: sortedNotifications,
              setRowHeight,
            }}
            width={width}
            height={height}
            itemSize={getRowHeight}
            ref={listRef}
          >
            {NotificationsFeedRow}
          </VariableSizeList>
        </Box>
      )}
    </AutoSizer>
  );
}

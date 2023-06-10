import { useEffect, useMemo, useState } from "react";
import { useFeed } from "./useFeed";
import { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
import { Kind } from "nostr-tools";

export function useNotifications({ pubkey }: { pubkey: string }) {
  const [notifications, setNotifications] = useState<NotificationsMap>(
    new Map()
  );
  const filter = useMemo<NDKFilter>(
    () => ({
      kinds: [Kind.Reaction, Kind.Text, Kind.Zap, 1808 as Kind, 6 as Kind],
      "#p": [pubkey],
    }),
    []
  );
  const events = useFeed(filter, [
    process.env.NEXT_PUBLIC_STEMSTR_RELAY as string,
  ]);

  useEffect(() => {
    const notifications: NotificationsMap = new Map();
    events.forEach((event) => {
      const eTag = event.tags.find((tag) => tag[0] === "e");
      const referencedEventId = eTag ? eTag[1] : "";
      const isGrouped = ![Kind.Text, 1808 as Kind].includes(event.kind as Kind);
      const index: NotificationsMapIndex = isGrouped
        ? JSON.stringify([event.kind as Kind, referencedEventId])
        : event.id;
      const notification = notifications.get(index);
      if (notification) {
        notification.created_at = Math.max(
          notification.created_at,
          event.created_at as number
        );
        notification.events.push(event);
        notifications.set(index, notification);
      } else {
        notifications.set(index, {
          kind: event.kind as Kind,
          referencedEventId,
          created_at: event.created_at as number,
          events: [event],
        });
      }
    });
    setNotifications(notifications);
  }, [events.length]);

  return notifications;
}

// Index is stringified [kind, referencedEventId]
// Kinds 1 and 1808 aren't grouped, so we just use the eventId
export type NotificationsMapIndex = string;
export type NotificationsMap = Map<NotificationsMapIndex, Notification>;

export type Notification = {
  created_at: number;
  events: NDKEvent[];
  kind: Kind;
  referencedEventId?: string;
};
import { useEffect, useMemo, useState } from "react";
import { useFeed } from "./useFeed";
import { NDKEvent, NDKFilter, NostrEvent } from "@nostr-dev-kit/ndk";
import { Kind } from "nostr-tools";
import { parseEventTags } from "ndk/utils";

export function useNotifications({ pubkey }: { pubkey: string }) {
  const [notifications, setNotifications] = useState<NotificationsMap>(
    new Map()
  );
  const filter = useMemo<NDKFilter>(
    () => ({
      kinds: [Kind.Reaction, Kind.Text, 1808 as Kind, 6 as Kind],
      "#p": [pubkey],
    }),
    []
  );
  const events = useFeed(filter, [
    process.env.NEXT_PUBLIC_STEMSTR_RELAY as string,
  ]);
  const zapFilter = useMemo<NDKFilter>(
    () => ({
      kinds: [Kind.Zap],
      "#p": [pubkey],
    }),
    []
  );
  const zapEvents = useFeed(zapFilter);

  useEffect(() => {
    const notifications: NotificationsMap = new Map();
    [...events, ...zapEvents].forEach((event) => {
      // Filter out non-stemstr zaps
      if (event.kind === Kind.Zap) {
        const descriptionTag = event.tags.find(
          (tag) => tag[0] === "description"
        );
        if (!descriptionTag) return;
        try {
          const description = JSON.parse(descriptionTag[1]) as NostrEvent;
          if (
            !description.tags.some(
              (tag) => tag[0] === "client" && tag[1] === "stemstr.app"
            )
          )
            return;
        } catch (err) {
          return;
        }
      }
      // Construct notification from event
      const { root, reply } = parseEventTags(event);
      const eTag = reply ? reply : root ? root : undefined;
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

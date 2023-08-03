import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { NDKEvent, NDKFilter, NostrEvent } from "@nostr-dev-kit/ndk";
import { useSelector } from "react-redux";
import { selectAuthState } from "store/Auth";
import { Kind } from "nostr-tools";
import { parseEventTags } from "./utils";
import { useFeed } from "./hooks/useFeed";

interface NostrNotificationsContext {
  notifications: NotificationsMap;
  hasUnreadNotifications: boolean;
  markAllAsRead: () => void;
  reset: () => void;
}

// Create a context to store the NostrNotifications instance
const NostrNotificationsContext = createContext<NostrNotificationsContext>({
  notifications: new Map(),
  hasUnreadNotifications: false,
  markAllAsRead: () => {},
  reset: () => {},
});

// NostrNotificationsProvider function component
const NostrNotificationsProvider = ({ children }: PropsWithChildren) => {
  const { pk: pubkey } = useSelector(selectAuthState);
  const [notificationsStatus, setNotificationsStatus] =
    useState<NotificationsStatus>(new Map());
  const hasUnreadNotifications = useMemo(
    () =>
      Array.from(notificationsStatus.entries()).some(
        ([_, value]) => value === false
      ),
    [notificationsStatus]
  );
  const [notifications, setNotifications] = useState<NotificationsMap>(
    new Map()
  );
  const filter = useMemo<NDKFilter>(
    () => ({
      kinds: [Kind.Reaction, Kind.Text, 1808 as Kind, 6 as Kind],
      "#p": pubkey ? [pubkey] : [],
    }),
    [pubkey]
  );
  const events = useFeed(
    filter,
    [process.env.NEXT_PUBLIC_STEMSTR_RELAY as string],
    3000
  );
  const zapFilter = useMemo<NDKFilter>(
    () => ({
      kinds: [Kind.Zap],
      "#p": pubkey ? [pubkey] : [],
    }),
    [pubkey]
  );
  const zapEvents = useFeed(zapFilter, undefined, 3000);
  const processedEventIds = useRef<string[]>([]);

  useEffect(() => {
    setNotifications((prev) => {
      const newEvents = [...events, ...zapEvents].filter((event) => {
        const isNewEvent = !processedEventIds.current.includes(event.id);
        if (isNewEvent) {
          processedEventIds.current.push(event.id);
        }
        return isNewEvent;
      });
      newEvents.forEach((event) => {
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
        const isGrouped = ![Kind.Text, 1808 as Kind].includes(
          event.kind as Kind
        );
        const index: NotificationsMapIndex = isGrouped
          ? JSON.stringify([event.kind as Kind, referencedEventId])
          : event.id;
        if (notificationsStatus.get(index) === undefined) {
          setNotificationsStatus((prev) => {
            prev.set(index, false);
            localStorage.setItem(
              "stemstr:cachedNotificationsStatus",
              JSON.stringify([...prev])
            );
            return new Map(prev);
          });
        }
        const notification = prev.get(index);
        if (notification) {
          notification.created_at = Math.max(
            notification.created_at,
            event.created_at as number
          );
          notification.events.push(event);
          prev.set(index, notification);
        } else {
          prev.set(index, {
            kind: event.kind as Kind,
            referencedEventId,
            created_at: event.created_at as number,
            events: [event],
          });
        }
      });
      return new Map(prev);
    });
  }, [events.length]);

  useEffect(() => {
    var storedData = localStorage.getItem("stemstr:cachedNotificationsStatus");
    if (storedData) {
      var restoredMap: NotificationsStatus = new Map(JSON.parse(storedData));
      setNotificationsStatus(restoredMap);
    }
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotificationsStatus((prev) => {
      prev.forEach((value, key) => {
        prev.set(key, true);
      });
      localStorage.setItem(
        "stemstr:cachedNotificationsStatus",
        JSON.stringify([...prev])
      );
      return new Map(prev);
    });
  }, [setNotificationsStatus]);

  const reset = () => {
    setNotifications(new Map());
  };

  // Return the provider with the NDK instance
  return (
    <NostrNotificationsContext.Provider
      value={{ notifications, hasUnreadNotifications, markAllAsRead, reset }}
    >
      {children}
    </NostrNotificationsContext.Provider>
  );
};

// Custom hook to access NDK instance from the context
const useNotifications = () => {
  const context = useContext(NostrNotificationsContext);
  if (context === undefined) {
    throw new Error("NostrNotificationsContext is undefined");
  }
  return context;
};

export { NostrNotificationsProvider, useNotifications };

export type NotificationsMapIndex = string;
export type NotificationsMap = Map<NotificationsMapIndex, Notification>;
// Maps notifications to read status
export type NotificationsStatus = Map<NotificationsMapIndex, boolean>;

export type Notification = {
  created_at: number;
  events: NDKEvent[];
  kind: Kind;
  referencedEventId?: string;
};

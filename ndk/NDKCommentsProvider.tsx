import { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
import { Kind } from "nostr-tools";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useNDK } from "./NDKProvider";
import { parseEventTags } from "./utils";
import { noop } from "utils/common";

export type Comment = {
  event: NDKEvent;
  children: NDKEvent[];
};

interface CommentsContextProps {
  rootEvent: NDKEvent;
  enabled: boolean;
}

type CommentsContextType = {
  rootEvent?: NDKEvent;
  comments?: Comment[];
  replyingTo?: NDKEvent;
  highlightedEvent?: NDKEvent;
  setReplyingTo: Dispatch<SetStateAction<NDKEvent>>;
  setHighlightedEvent: Dispatch<SetStateAction<NDKEvent | undefined>>;
};

const CommentsContext = createContext<CommentsContextType>({
  setReplyingTo: noop,
  setHighlightedEvent: noop,
});

export const CommentsProvider = ({
  children,
  rootEvent,
  enabled,
}: PropsWithChildren<CommentsContextProps>) => {
  const { ndk } = useNDK();
  const [events, setEvents] = useState<NDKEvent[]>([]);
  const [comments, setComments] = useState<Comment[] | undefined>();
  const [replyingTo, setReplyingTo] = useState<NDKEvent>(rootEvent);
  const [highlightedEvent, setHighlightedEvent] = useState<NDKEvent>();

  useEffect(() => {
    if (enabled && ndk) {
      const filter: NDKFilter = {
        kinds: [Kind.Text],
        "#e": [rootEvent.id],
      };
      ndk.fetchEvents(filter).then((eventSet) => {
        const events = Array.from(eventSet.values()).sort(
          (a, b) => b.created_at! - a.created_at!
        );
        setEvents(events);
      });
    } else {
      setComments(undefined);
    }
  }, [enabled, ndk]);

  useEffect(() => {
    if (events.length) {
      let comments: Comment[] = events
        .filter((event) => {
          const { root, reply } = parseEventTags(event);
          if (reply && reply[1] === rootEvent.id) return true;
          return !reply && root && root[1] === rootEvent.id;
        })
        .map((event) => {
          const children = events
            .filter((child) => {
              return eventIsDescendantOf(child, event, events);
            })
            .sort((a, b) => a.created_at! - b.created_at!);
          return { event, children };
        });
      setComments(comments);
    }
  }, [events]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (highlightedEvent) {
      setEvents((events) => {
        if (events.find((event) => event.id === highlightedEvent.id))
          return events;
        return [highlightedEvent, ...events];
      });
      timeout = setTimeout(() => {
        setHighlightedEvent(undefined);
      }, 5000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [highlightedEvent]);

  const contextValue: CommentsContextType = {
    rootEvent,
    comments,
    replyingTo,
    highlightedEvent,
    setReplyingTo,
    setHighlightedEvent,
  };

  return (
    <CommentsContext.Provider value={contextValue}>
      {children}
    </CommentsContext.Provider>
  );
};

const eventIsDescendantOf = (
  child: NDKEvent,
  ancestor: NDKEvent,
  events: NDKEvent[]
): boolean => {
  const { reply } = parseEventTags(child);
  if (!reply) return false;
  if (reply[1] === ancestor.id) return true;
  const parent = events.find((event) => event.id === reply[1]);
  if (!parent) return false;
  return eventIsDescendantOf(parent, ancestor, events);
};

export const useComments = () => {
  const context = useContext(CommentsContext);
  if (context === undefined) {
    throw new Error("useComments must be used within a CommentsProvider");
  }
  return context;
};

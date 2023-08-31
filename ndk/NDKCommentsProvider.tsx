import { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
import { Kind } from "nostr-tools";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
  useEffect,
} from "react";
import { useNDK } from "./NDKProvider";
import { parseEventTags } from "./utils";

type Comment = {
  event: NDKEvent;
  children: NDKEvent[];
};

interface CommentsContextProps {
  noteId: string;
  enabled: boolean;
}

type CommentsContextType = {
  comments?: Comment[];
};

const CommentsContext = createContext<CommentsContextType>({});

export const CommentsProvider = ({
  children,
  noteId,
  enabled,
}: PropsWithChildren<CommentsContextProps>) => {
  const { ndk } = useNDK();
  const [comments, setComments] = useState<Comment[] | undefined>();

  useEffect(() => {
    if (enabled && ndk) {
      const filter: NDKFilter = {
        kinds: [Kind.Text],
        "#e": [noteId],
      };
      ndk.fetchEvents(filter).then((eventSet) => {
        const events = Array.from(eventSet.values()).sort(
          (a, b) => b.created_at! - a.created_at!
        );
        console.log(events);
        let comments: Comment[] = events
          .filter((event) => {
            const { root, reply } = parseEventTags(event);
            return root && !reply && root[1] === noteId;
          })
          .map((event) => {
            const children = events.filter((child) => {
              return eventIsDescendantOf(child, event, events);
            });
            return { event, children };
          });
        setComments(comments);
      });
    } else {
      setComments(undefined);
    }
  }, [enabled, ndk]);

  const contextValue: CommentsContextType = {
    comments,
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

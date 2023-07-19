import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from "react";
import { NDKUser, NDKEvent, NostrEvent } from "@nostr-dev-kit/ndk";
import { useUser } from "./hooks/useUser";
import { useNDK } from "./NDKProvider";

interface EventContextProps {
  event: NDKEvent;
  repostedBy?: NDKUser;
}

const EventContext = createContext<EventContextProps>({
  event: {} as NDKEvent,
});

export const EventProvider = ({
  children,
  event,
}: PropsWithChildren<EventContextProps>) => {
  const { ndk } = useNDK();
  const repostedBy = useUser(
    event.kind && [6, 16].includes(event.kind) ? event.pubkey : undefined
  );
  const displayedEvent = useMemo(() => {
    if (event.kind && [6, 16].includes(event.kind)) {
      try {
        const rawEvent = JSON.parse(event.content) as NostrEvent;
        const displayedEvent = new NDKEvent(ndk, rawEvent);
        return displayedEvent;
      } catch (error) {}
    }
    return event;
  }, [event.kind]);

  return (
    <EventContext.Provider value={{ event: displayedEvent, repostedBy }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};

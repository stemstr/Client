import { createContext, type PropsWithChildren, useContext } from "react";
import { type NDKEvent } from "@nostr-dev-kit/ndk";

interface EventContextProps {
  event: NDKEvent;
}

const EventContext = createContext<EventContextProps>({
  event: {} as NDKEvent,
});

export const EventProvider = ({
  children,
  event,
}: PropsWithChildren<EventContextProps>) => (
  <EventContext.Provider value={{ event }}>{children}</EventContext.Provider>
);

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};

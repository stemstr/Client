import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  NDKUser,
  NDKEvent,
  NostrEvent,
  zapInvoiceFromEvent,
  NDKZapInvoice,
} from "@nostr-dev-kit/ndk";
import { useUser } from "./hooks/useUser";
import { useNDK } from "./NDKProvider";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState } from "store/Auth";
import { AppState } from "store/Store";
import {
  selectNoteState,
  setCommentCount,
  setIsLikedByCurrentUser,
  setIsRepostedByCurrentUser,
  setIsZappedByCurrentUser,
  setReactionCount,
  setRepostCount,
  setZapsAmountTotal,
} from "store/Notes";
import { Kind } from "nostr-tools";
import { createRelaySet } from "./utils";
import { DEFAULT_RELAY_URLS } from "../constants";

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

  const dispatch = useDispatch();
  const auth = useSelector(selectAuthState);
  const noteId = event.id;
  const { zapsAmountTotal, reactionCount, commentCount } = useSelector(
    (state: AppState) => selectNoteState(state, noteId)
  );
  const filter = useMemo(
    () => ({
      kinds: [Kind.Text, 1808 as Kind, Kind.Reaction, Kind.Zap, 6, 16],
      "#e": [noteId],
    }),
    [noteId]
  );
  const [hasFetchedMetaEvents, sethasFetchedMetaEvents] = useState(false);
  const dispatchData = useCallback(
    async (events: NDKEvent[]) => {
      const reactions = events.filter(({ kind }) => kind === Kind.Reaction);
      const reposts = events.filter(
        ({ kind }) => kind && [6, 16].includes(kind)
      );
      const newCommentCount = events.filter(({ kind, content }) =>
        [Kind.Text, 1808].includes(kind as Kind)
      ).length;
      const validZapInvoices = events
        .map(zapInvoiceFromEvent)
        .filter((zi) => zi !== null) as NDKZapInvoice[];
      const getZapsAmountTotal = () => {
        return validZapInvoices.reduce((acc, { amount: amountInMillisats }) => {
          const amount = amountInMillisats ? amountInMillisats / 1000 : 0;

          return acc + amount;
        }, 0);
      };
      const newZapsAmountTotal = getZapsAmountTotal();

      // sometimes the subscription is not returning the right amounts after initial load.
      // this makes sure it doesn't override the previously loaded values since the new values should not be less
      // than the previous values.
      if (
        commentCount > newCommentCount ||
        reactionCount > reactions.length ||
        zapsAmountTotal > newZapsAmountTotal
      ) {
        return;
      }

      dispatch(setReactionCount({ id: noteId, value: reactions.length }));
      dispatch(
        setIsLikedByCurrentUser({
          id: noteId,
          value: Boolean(reactions.find((ev) => ev.pubkey === auth.pk)),
        })
      );
      dispatch(setRepostCount({ id: noteId, value: reposts.length }));
      dispatch(
        setIsRepostedByCurrentUser({
          id: noteId,
          value: Boolean(reposts.find((ev) => ev.pubkey === auth.pk)),
        })
      );
      dispatch(setCommentCount({ id: noteId, value: newCommentCount }));
      dispatch(setZapsAmountTotal({ id: noteId, value: newZapsAmountTotal }));
      dispatch(
        setIsZappedByCurrentUser({
          id: noteId,
          value: Boolean(
            validZapInvoices.find(({ zappee }) => zappee === auth.pk)
          ),
        })
      );
    },
    [auth.pk, dispatch, noteId, commentCount, reactionCount, zapsAmountTotal]
  );

  useEffect(() => {
    if (!ndk || hasFetchedMetaEvents) {
      return;
    }
    sethasFetchedMetaEvents(true);

    const relaySet = createRelaySet(
      [...DEFAULT_RELAY_URLS, process.env.NEXT_PUBLIC_STEMSTR_RELAY as string],
      ndk
    );

    ndk
      .fetchEvents(filter, {}, relaySet)
      .then((events) => Array.from(events))
      .then(dispatchData)
      .catch(console.error);
  }, [ndk, filter, dispatchData, hasFetchedMetaEvents]);

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

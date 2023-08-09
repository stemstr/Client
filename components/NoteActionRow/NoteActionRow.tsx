import { Group } from "@mantine/core";
import { useMemo, useEffect, useCallback, useState } from "react";
import NoteActionComment from "../NoteAction/NoteActionComment";
import NoteActionLike from "../NoteAction/NoteActionLike";
import NoteActionZap from "../NoteActionZap/NoteActionZap";
import { useEvent } from "../../ndk/NDKEventProvider";
import { Kind } from "nostr-tools";
import {
  NDKEvent,
  NDKZapInvoice,
  zapInvoiceFromEvent,
} from "@nostr-dev-kit/ndk";
import { createRelaySet } from "../../ndk/utils";
import { useNDK } from "../../ndk/NDKProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  setReactionCount,
  setIsLikedByCurrentUser,
  setCommentCount,
  setZapsAmountTotal,
  selectNoteState,
  setIsZappedByCurrentUser,
  setRepostCount,
  setIsRepostedByCurrentUser,
} from "../../store/Notes";
import { selectAuthState } from "../../store/Auth";
import { DEFAULT_RELAY_URLS } from "../../constants";
import { AppState } from "../../store/Store";
import NoteActionRepost from "components/NoteAction/NoteActionRepost";

const NoteActionRow = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuthState);
  const { ndk } = useNDK();
  const { event } = useEvent();
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
    <Group position="apart" noWrap spacing="xs" sx={{ overflowX: "hidden" }}>
      <NoteActionComment />
      <NoteActionRepost />
      <NoteActionLike />
      <NoteActionZap />
    </Group>
  );
};

export default NoteActionRow;

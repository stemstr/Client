import { Group, Space } from "@mantine/core";
import { useMemo, useEffect, useCallback } from "react";
import NoteActionComment from "../NoteAction/NoteActionComment";
import NoteActionLike from "../NoteAction/NoteActionLike";
import NoteActionZap from "../NoteActionZap/NoteActionZap";
import { useEvent } from "../../ndk/NDKEventProvider";
import { Kind, nip57 } from "nostr-tools";
import { NDKEvent, zapInvoiceFromEvent } from "@nostr-dev-kit/ndk";
import { createRelaySet, fetchEvents } from "../../ndk/utils";
import { useNDK } from "../../ndk/NDKProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  setReactionCount,
  setIsLikedByCurrentUser,
  setCommentCount,
  setZapsAmountTotal,
  selectNoteState,
} from "../../store/Notes";
import { selectAuthState } from "../../store/Auth";
import { defaultRelayUrls } from "../../constants";
import { AppState } from "../../store/Store";

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
      kinds: [Kind.Text, 1808 as Kind, Kind.Reaction, Kind.Zap],
      "#e": [noteId],
    }),
    [noteId]
  );
  const dispatchData = useCallback(
    async (events: NDKEvent[]) => {
      const reactions = events.filter(({ kind }) => kind === Kind.Reaction);
      const newCommentCount = events.filter(({ kind, content }) =>
        [Kind.Text, 1808].includes(kind as Kind)
      ).length;
      const getZapsAmountTotal = () => {
        const validZaps = events.filter(
          (event) =>
            event.kind === Kind.Zap &&
            nip57.validateZapRequest(
              event.getMatchingTags("description")[0][1]
            ) === null
        );

        return validZaps.reduce((acc, event) => {
          const amountInMillisats = zapInvoiceFromEvent(event)?.amount;
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
      dispatch(setCommentCount({ id: noteId, value: newCommentCount }));
      dispatch(setZapsAmountTotal({ id: noteId, value: newZapsAmountTotal }));
    },
    [auth.pk, dispatch, noteId, commentCount, reactionCount, zapsAmountTotal]
  );

  useEffect(() => {
    if (!ndk) {
      return;
    }

    const relaySet = createRelaySet(
      [...defaultRelayUrls, process.env.NEXT_PUBLIC_STEMSTR_RELAY as string],
      ndk
    );

    fetchEvents(filter, ndk, relaySet)
      .then((events) => Array.from(events))
      .then(dispatchData)
      .catch(console.error);
  }, [ndk, filter, dispatchData]);

  return (
    <Group position="apart" noWrap spacing="xs" sx={{ overflowX: "hidden" }}>
      <NoteActionComment />
      <Space w={59} />
      <NoteActionLike />
      <NoteActionZap />
    </Group>
  );
};

export default NoteActionRow;

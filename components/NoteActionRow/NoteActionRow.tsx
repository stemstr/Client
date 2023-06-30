import { Group, Space } from "@mantine/core";
import { useMemo, useEffect, useCallback } from "react";
import NoteActionComment from "../NoteAction/NoteActionComment";
import NoteActionLike from "../NoteAction/NoteActionLike";
import NoteActionZap from "../NoteActionZap/NoteActionZap";
import { useEvent } from "../../ndk/NDKEventProvider";
import { Kind, nip57 } from "nostr-tools";
import { NDKEvent, zapInvoiceFromEvent } from "@nostr-dev-kit/ndk";
import { fetchEvents } from "../../ndk/utils";
import { useNDK } from "../../ndk/NDKProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  setReactionCount,
  setIsLikedByCurrentUser,
  setCommentCount,
  setZapsAmountTotal,
} from "../../store/Notes";
import { selectAuthState } from "../../store/Auth";

const NoteActionRow = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuthState);
  const { ndk } = useNDK();
  const { event } = useEvent();
  const noteId = event.id;
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
      const commentCount = events.filter(({ kind, content }) =>
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
          return acc + (zapInvoiceFromEvent(event)?.amount ?? 0);
        }, 0);
      };

      dispatch(setReactionCount({ id: noteId, value: reactions.length }));
      dispatch(
        setIsLikedByCurrentUser({
          id: noteId,
          value: Boolean(reactions.find((ev) => ev.pubkey === auth.pk)),
        })
      );
      dispatch(setCommentCount({ id: noteId, value: commentCount }));
      dispatch(setZapsAmountTotal({ id: noteId, value: getZapsAmountTotal() }));
    },
    [auth.pk, dispatch, noteId]
  );

  useEffect(() => {
    if (!ndk) {
      return;
    }

    fetchEvents(filter, ndk)
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

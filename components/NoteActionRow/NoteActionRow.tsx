import { Group, Space } from "@mantine/core";
import { useMemo, useEffect, useState } from "react";
import NoteActionComment from "../NoteAction/NoteActionComment";
import NoteActionLike from "../NoteAction/NoteActionLike";
import NoteActionZap from "../NoteActionZap/NoteActionZap";
import { useEvent } from "../../ndk/NDKEventProvider";
import { Kind, nip57 } from "nostr-tools";
import { NDKEvent, zapInvoiceFromEvent } from "@nostr-dev-kit/ndk";
import { fetchEvents } from "../../ndk/utils";
import { useNDK } from "../../ndk/NDKProvider";

const NoteActionRow = () => {
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
  const [events, setEvents] = useState<NDKEvent[]>([]);
  const commentCount = events.filter(({ kind, content }) =>
    [Kind.Text, 1808].includes(kind as Kind)
  ).length;
  const reactions = events.filter(({ kind }) => kind === Kind.Reaction);
  const getZapsTotal = () => {
    const validZaps = events.filter(
      (event) =>
        event.kind === Kind.Zap &&
        nip57.validateZapRequest(event.getMatchingTags("description")[0][1]) ===
          null
    );

    return validZaps.reduce((acc, event) => {
      return acc + (zapInvoiceFromEvent(event)?.amount ?? 0);
    }, 0);
  };

  useEffect(() => {
    if (!ndk) {
      return;
    }

    fetchEvents(filter, ndk)
      .then((events) => setEvents(Array.from(events)))
      .catch(console.error);

    return () => {
      setEvents([]);
    };
  }, [ndk, filter]);

  return (
    <Group position="apart" noWrap spacing="xs" sx={{ overflowX: "hidden" }}>
      <NoteActionComment commentCount={commentCount} />
      <Space w={59} />
      <NoteActionLike reactions={reactions} />
      <NoteActionZap zapsTotal={getZapsTotal()} />
    </Group>
  );
};

export default NoteActionRow;

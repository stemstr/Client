import { Group, Text } from "@mantine/core";
import { CommentIcon } from "icons/StemstrIcon";
import requireAuth from "../../utils/hoc/requireAuth";
import NoteAction from "./NoteAction";
import { useEvent } from "../../ndk/NDKEventProvider";
import { useEventReplies } from "../../ndk/hooks/useEventReplies";

const NoteActionComment = ({ onClick }) => {
  const { event } = useEvent();
  const replies = useEventReplies(event);

  return (
    <NoteAction onClick={onClick}>
      <Group position="center" spacing={6}>
        <CommentIcon width={18} height={18} />{" "}
        <Text lh="normal" c="gray.1">
          {replies?.length ? replies.length : ""}
        </Text>
      </Group>
    </NoteAction>
  );
};

export default requireAuth(NoteActionComment);

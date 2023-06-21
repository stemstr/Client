import { Group, Text } from "@mantine/core";
import { CommentIcon } from "icons/StemstrIcon";
import requireAuth from "../../utils/hoc/requireAuth";
import NoteAction from "./NoteAction";
import { useEvent } from "../../ndk/NDKEventProvider";
import { useEventReplies } from "../../ndk/hooks/useEventReplies";
import { openSheet } from "../../store/Sheets";
import { useDispatch } from "react-redux";

const NoteActionComment = () => {
  const { event } = useEvent();
  const replies = useEventReplies(event);
  const dispatch = useDispatch();
  const handleClickComment = () => {
    dispatch(
      openSheet({
        sheetKey: "postSheet",
        replyingTo: event.rawEvent(),
      })
    );
  };

  return (
    <NoteAction onClick={handleClickComment}>
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

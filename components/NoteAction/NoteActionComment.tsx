import { Group, Text } from "@mantine/core";
import { CommentIcon } from "icons/StemstrIcon";
import NoteAction from "./NoteAction";
import { useEvent } from "../../ndk/NDKEventProvider";
import { openSheet } from "../../store/Sheets";
import { useDispatch } from "react-redux";
import useAuth from "hooks/useAuth";

const NoteActionComment = ({ commentCount }: { commentCount: number }) => {
  const { event } = useEvent();
  const dispatch = useDispatch();
  const { guardAuth } = useAuth();

  const handleClickComment = () => {
    if (!guardAuth()) return;

    dispatch(
      openSheet({
        sheetKey: "postSheet",
        replyingTo: event.rawEvent(),
      })
    );
  };

  return (
    <NoteAction onClick={handleClickComment}>
      <Group position="center" spacing={6} noWrap>
        <CommentIcon width={18} height={18} />{" "}
        <Text lh="normal" c="gray.1">
          {commentCount > 0 ? commentCount : ""}
        </Text>
      </Group>
    </NoteAction>
  );
};

export default NoteActionComment;

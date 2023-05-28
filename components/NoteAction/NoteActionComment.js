import { Group, Text } from "@mantine/core";
import { CommentIcon } from "icons/StemstrIcon";
import requireAuth from "../../utils/hoc/requireAuth";
import NoteAction from "./NoteAction";

const NoteActionComment = ({ onClick, note }) => {
  return (
    <NoteAction onClick={onClick}>
      <Group position="center" spacing={6}>
        <CommentIcon width={18} height={18} />{" "}
        <Text lh="normal" c="gray.1">
          {note.replies?.length ? note.replies.length : ""}
        </Text>
      </Group>
    </NoteAction>
  );
};

export default requireAuth(NoteActionComment);

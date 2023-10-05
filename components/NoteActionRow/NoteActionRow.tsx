import { Group } from "@mantine/core";
import NoteActionComment from "../NoteAction/NoteActionComment";
import NoteActionLike from "../NoteAction/NoteActionLike";
import NoteActionZap from "../NoteActionZap/NoteActionZap";
import NoteActionRepost from "components/NoteAction/NoteActionRepost";

const NoteActionRow = () => {
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

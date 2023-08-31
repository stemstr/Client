import { Group, Text } from "@mantine/core";
import { CommentIcon } from "icons/StemstrIcon";
import NoteAction from "./NoteAction";
import { useEvent } from "../../ndk/NDKEventProvider";
import { useSelector } from "react-redux";
import useAuth from "hooks/useAuth";
import { AppState } from "../../store/Store";
import { selectNoteState } from "../../store/Notes";
import { useDisclosure } from "@mantine/hooks";
import CommentsDrawer from "components/CommentsDrawer/CommentsDrawer";

const NoteActionComment = () => {
  const { event } = useEvent();
  const { guardAuth, guardSubscribed } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);
  const { commentCount } = useSelector((state: AppState) =>
    selectNoteState(state, event.id)
  );

  const handleClickComment = () => {
    if (!guardAuth()) return;
    if (!guardSubscribed()) return;
    open();
  };

  return (
    <>
      <CommentsDrawer opened={opened} onClose={close} onDragEnd={close} />
      <NoteAction onClick={handleClickComment}>
        <Group position="center" spacing={6} noWrap>
          <CommentIcon width={18} height={18} />{" "}
          <Text lh="normal" c="gray.1">
            {commentCount > 0 ? commentCount : ""}
          </Text>
        </Group>
      </NoteAction>
    </>
  );
};

export default NoteActionComment;

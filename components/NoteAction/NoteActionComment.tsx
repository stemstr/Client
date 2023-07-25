import { Group, Text } from "@mantine/core";
import { CommentIcon } from "icons/StemstrIcon";
import NoteAction from "./NoteAction";
import { useEvent } from "../../ndk/NDKEventProvider";
import { openSheet } from "../../store/Sheets";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "hooks/useAuth";
import { AppState } from "../../store/Store";
import { selectNoteState } from "../../store/Notes";
import { useSubscribeWizard } from "components/SubscribeWizard/SubscribeWizardProvider";

const NoteActionComment = () => {
  const { event } = useEvent();
  const dispatch = useDispatch();
  const { guardAuth, isSubscribed } = useAuth();
  const { commentCount } = useSelector((state: AppState) =>
    selectNoteState(state, event.id)
  );
  const { start: startSubscribeWizard } = useSubscribeWizard();

  const handleClickComment = () => {
    if (!guardAuth()) return;
    if (!isSubscribed()) {
      startSubscribeWizard();
      return;
    }

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

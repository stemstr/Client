import { KeyboardEvent } from "react";
import {
  DraftHandleValue,
  Editor,
  EditorState,
  getDefaultKeyBinding,
} from "draft-js";
import { Box } from "@mantine/core";
import { useDraftEditor } from "./DraftEditorProvider";
import { useComments } from "ndk/NDKCommentsProvider";

export default function DraftEditorTextarea() {
  const {
    mentionQuery,
    editorState,
    handleEditorChange,
    selectCurrentMentionOption,
    navigateMentionList,
    rawNoteContent,
  } = useDraftEditor();
  const { setReplyingTo, rootEvent } = useComments();

  const handleKeyCommand = (command: string): DraftHandleValue => {
    switch (command) {
      case "decrement-mention-list":
        navigateMentionList(-1);
        return "handled";
      case "increment-mention-list":
        navigateMentionList(1);
        return "handled";
      case "reset-replying-to":
        if (rootEvent) {
          setReplyingTo(rootEvent);
        }
        return "handled";
    }

    return "not-handled";
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowUp":
        if (mentionQuery) {
          return "decrement-mention-list";
        }
        break;
      case "ArrowDown":
        if (mentionQuery) {
          return "increment-mention-list";
        }
        break;
      case "Backspace":
        if (!rawNoteContent) {
          return "reset-replying-to";
        }
        break;
    }
    return getDefaultKeyBinding(e);
  };

  const handleReturn = (e: KeyboardEvent, editorState: EditorState) => {
    if (mentionQuery) {
      selectCurrentMentionOption();
      return "handled";
    }
    return "not-handled";
  };

  return (
    <Box miw={0} sx={{ flexGrow: 1 }}>
      <Editor
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={handleKeyDown}
        handleReturn={handleReturn}
        onChange={handleEditorChange}
        placeholder="Add your comment"
      />
    </Box>
  );
}

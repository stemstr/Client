import { Avatar, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import DraftEditor from "components/DraftEditor/DraftEditor";
import {
  DraftEditorProvider,
  draftEditorDecorator,
} from "components/DraftEditor/DraftEditorProvider";
import MentionMenu from "components/DraftEditor/MentionMenu";
import { EditorState } from "draft-js";
import useAuth from "hooks/useAuth";
import { useComments } from "ndk/NDKCommentsProvider";
import { useNDK } from "ndk/NDKProvider";
import useProfilePicSrc from "ndk/hooks/useProfilePicSrc";
import { useUser } from "ndk/hooks/useUser";
import { createKind1Event, getFormattedAtName } from "ndk/utils";
import { useState } from "react";
import { noop } from "utils/common";

type CommentFormValues = {
  comment: string;
};

export default function CommentForm() {
  const { ndk, stemstrRelaySet } = useNDK();
  const { replyingTo, setReplyingTo, rootEvent, setHighlightedEvent } =
    useComments();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(draftEditorDecorator)
  );
  const isShowingName = replyingTo?.id !== rootEvent?.id;
  const replyingToUser = useUser(
    isShowingName ? replyingTo?.pubkey : undefined
  );
  const formattedReplyingToName = isShowingName
    ? getFormattedAtName(replyingToUser)
    : "";
  const { authState } = useAuth();
  const user = useUser(authState.pk);
  const src = useProfilePicSrc(user);
  const form = useForm<CommentFormValues>({
    initialValues: {
      comment: "",
    },
    validate: {
      comment: (value) => (value ? null : "Comment required."),
    },
  });

  const handleSubmit = (values: CommentFormValues) => {
    if (ndk && replyingTo) {
      const event = createKind1Event(ndk, values.comment, {
        replyingTo: replyingTo.rawEvent(),
      });
      event
        .publish(stemstrRelaySet)
        .then(() => {
          // Reset form
          setHighlightedEvent(event);
          setEditorState(EditorState.createEmpty(draftEditorDecorator));
          if (rootEvent) {
            setReplyingTo(rootEvent);
          }
          form.reset();
        })
        .catch(noop);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group spacing="sm" py={8} px="md" pos="relative" noWrap>
        <DraftEditorProvider
          editorState={editorState}
          setEditorState={setEditorState}
          replyingTo={replyingTo}
        >
          <MentionMenu />
          <Avatar
            src={user?.profile?.image || src}
            alt={user?.profile?.name}
            size={36}
            radius={18}
            sx={(theme) => ({
              border: `1px solid ${theme.colors.gray[4]}`,
            })}
          />
          <DraftEditor
            onChange={(value) => {
              form.setFieldValue("comment", value);
            }}
            replyingToName={formattedReplyingToName}
          />
        </DraftEditorProvider>
      </Group>
    </form>
  );
}

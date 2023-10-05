import { Avatar, Button, Group, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import useAuth from "hooks/useAuth";
import { useComments } from "ndk/NDKCommentsProvider";
import { useNDK } from "ndk/NDKProvider";
import useProfilePicSrc from "ndk/hooks/useProfilePicSrc";
import { useUser } from "ndk/hooks/useUser";
import { createKind1Event, getFormattedAtName } from "ndk/utils";
import { ChangeEventHandler, KeyboardEventHandler } from "react";

type CommentFormValues = {
  comment: string;
};

export default function CommentForm() {
  const { ndk, stemstrRelaySet } = useNDK();
  const {
    replyingTo,
    setReplyingTo,
    rootEvent,
    setHighlightedEvent,
    commentTextareaRef,
  } = useComments();
  const isShowingName = replyingTo?.id !== rootEvent?.id;
  const replyingToUser = useUser(
    isShowingName ? replyingTo?.pubkey : undefined
  );
  const { authState } = useAuth();
  const user = useUser(authState.pk);
  const src = useProfilePicSrc(user);
  const form = useForm<CommentFormValues>({
    initialValues: {
      comment: "",
    },
    validate: {},
  });

  const formattedReplyingToName = replyingTo?.pubkey
    ? getFormattedAtName(replyingToUser)
    : "";

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    form.setFieldValue("comment", e.target.value);
  };

  const handleSubmit = (values: CommentFormValues) => {
    if (ndk && replyingTo) {
      const event = createKind1Event(ndk, values.comment, {
        replyingTo: replyingTo.rawEvent(),
      });
      event.publish(stemstrRelaySet).then(() => {
        setHighlightedEvent(event);
        form.reset();
        if (rootEvent) {
          setReplyingTo(rootEvent);
        }
      });
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Backspace") {
      if (!form.values.comment) {
        if (rootEvent) {
          setReplyingTo(rootEvent);
        }
      }
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group spacing="sm" py={8} px="md">
        <Avatar
          src={user?.profile?.image || src}
          alt={user?.profile?.name}
          size={36}
          radius={18}
          sx={(theme) => ({
            border: `1px solid ${theme.colors.gray[4]}`,
          })}
        />
        <Textarea
          ref={commentTextareaRef}
          autoFocus
          placeholder="Add your comment"
          sx={{ flexGrow: 1 }}
          value={form.values.comment}
          onChange={handleChange}
          radius="md"
          autosize
          maxRows={3}
          size="xs"
          onKeyDown={handleKeyDown}
          icon={
            replyingTo?.id === rootEvent?.id ? undefined : (
              <Text c="purple.5" fz="xs" px={4} truncate>
                {formattedReplyingToName}
              </Text>
            )
          }
          iconWidth={Math.min(84, formattedReplyingToName.length * 12 + 8)}
          rightSection={
            form.values.comment ? (
              <Button
                type="submit"
                fz={13}
                mih={0}
                py={2}
                px={12}
                lh="normal"
                h={24}
                sx={{ borderRadius: 100 }}
              >
                Post
              </Button>
            ) : undefined
          }
          rightSectionWidth={form.values.comment ? 68 : undefined}
        />
      </Group>
    </form>
  );
}

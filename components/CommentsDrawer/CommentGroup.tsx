import { Box, Button, DefaultProps, Group, Space } from "@mantine/core";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import NoteActionLike from "components/NoteAction/NoteActionLike";
import NoteActionMore from "components/NoteAction/NoteActionMore";
import NoteActionZap from "components/NoteActionZap/NoteActionZap";
import NoteContent from "components/NoteContent/NoteContent";
import {
  RelativeTime,
  UserDetailsAnchorWrapper,
  UserDetailsAvatar,
  UserDetailsDisplayName,
  UserDetailsName,
} from "components/NoteHeader/NoteHeader";
import { Comment, useComments } from "ndk/NDKCommentsProvider";
import { EventProvider, useEvent } from "ndk/NDKEventProvider";
import { useEffect, useState } from "react";

type CommentProps = {
  comment: Comment;
};

export default function CommentGroup({ comment }: CommentProps) {
  return (
    <Box pb={8}>
      <EventProvider event={comment.event}>
        <CommentView />
      </EventProvider>
      <CommentChildren events={comment.children} />
    </Box>
  );
}

const CommentChildren = ({ events }: { events: NDKEvent[] }) => {
  const { highlightedEvent } = useComments();
  const [isShowingReplies, setIsShowingReplies] = useState(false);

  useEffect(() => {
    if (events.find((event) => event.id === highlightedEvent?.id)) {
      setIsShowingReplies(true);
    }
  }, [events, highlightedEvent]);

  const handleShowRepliesClick = () => {
    setIsShowingReplies(true);
  };

  if (!events.length) return null;

  return isShowingReplies ? (
    <Box px="md">
      {events.map((event) => (
        <EventProvider event={event}>
          <CommentView isReply={true} />
        </EventProvider>
      ))}
    </Box>
  ) : (
    <Button
      onClick={handleShowRepliesClick}
      variant="subtle"
      size="xs"
      ml={46}
      ta="left"
      p={0}
      mih={0}
      c="white"
      fullWidth={false}
    >
      － View {events.length} more replies
    </Button>
  );
};

const CommentView = ({ isReply = false }: { isReply?: boolean }) => {
  const { event } = useEvent();
  const { highlightedEvent } = useComments();
  const isHighlighted = event.id === highlightedEvent?.id;

  return (
    <Box
      pr={isReply ? 8 : 16}
      pl={isReply ? 46 : 16}
      py={8}
      bg={isHighlighted ? "dark.7" : undefined}
      sx={{
        borderRadius: isReply ? 8 : 0,
        transition: ".5s background-color ease",
      }}
    >
      <CommentHeader isReply={isReply} />
      <Space h={isReply ? 12 : 8} />
      <CommentContent isReply={isReply} />
      <Space h={12} />
      <CommentActions isReply={isReply} />
    </Box>
  );
};

const CommentHeader = ({
  isReply,
  ...rest
}: DefaultProps & { isReply: boolean }) => {
  return (
    <Group position="apart" noWrap {...rest}>
      <UserDetailsAnchorWrapper>
        <UserDetailsAvatar size={isReply ? 28 : 36} />
        <UserDetailsDisplayName ml={6} size="sm" />
        <UserDetailsName truncate />
        <RelativeTime />
      </UserDetailsAnchorWrapper>
      <NoteActionMore size={16} />
    </Group>
  );
};

const CommentContent = ({ isReply = false }: { isReply?: boolean }) => {
  const { event } = useEvent();

  return <NoteContent fz="sm" ml={isReply ? 0 : 46} content={event.content} />;
};

const CommentActions = ({ isReply = false }: { isReply?: boolean }) => {
  return (
    <Group spacing={12} ml={isReply ? 0 : 46}>
      <CommentActionReply />
      <NoteActionLike size={16} c="white" />
      <NoteActionZap size={16} c="white" />
    </Group>
  );
};

const CommentActionReply = () => {
  const { setReplyingTo, draftEditorRef } = useComments();
  const { event } = useEvent();

  const handleClick = () => {
    setReplyingTo(event);
    draftEditorRef?.current?.focus();
  };

  return (
    <Button
      onClick={handleClick}
      fz={13}
      variant="subtle"
      c="purple.0"
      py={4}
      px={16}
      mih={0}
    >
      Reply
    </Button>
  );
};

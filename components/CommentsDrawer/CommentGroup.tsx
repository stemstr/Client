import { Box, Button, DefaultProps, Group, Space } from "@mantine/core";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import NoteActionLike from "components/NoteAction/NoteActionLike";
import NoteActionMore from "components/NoteAction/NoteActionMore";
import NoteActionZap from "components/NoteActionZap/NoteActionZap";
import NoteContent from "components/NoteContent/NoteContent";
import {
  RelativeTime,
  UserDetailsAvatar,
  UserDetailsDisplayName,
  UserDetailsName,
} from "components/NoteHeader/NoteHeader";
import { Comment } from "ndk/NDKCommentsProvider";
import { EventProvider, useEvent } from "ndk/NDKEventProvider";
import { useState } from "react";

type CommentProps = {
  comment: Comment;
};

export default function CommentGroup({ comment }: CommentProps) {
  return (
    <Box py={8} px={16}>
      <EventProvider event={comment.event}>
        <CommentView />
      </EventProvider>
      <CommentChildren events={comment.children} />
    </Box>
  );
}

const CommentChildren = ({ events }: { events: NDKEvent[] }) => {
  const [isShowingReplies, setIsShowingReplies] = useState(false);

  const handleShowRepliesClick = () => {
    setIsShowingReplies(true);
  };

  if (!events.length) return null;

  return isShowingReplies ? (
    <Box>
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

  return (
    <Box py={12}>
      <CommentHeader isReply={isReply} ml={isReply ? 46 : undefined} />
      <Space h={isReply ? 12 : 8} />
      <CommentContent />
      <Space h={12} />
      <CommentActions />
    </Box>
  );
};

const CommentHeader = ({
  isReply,
  ...rest
}: DefaultProps & { isReply: boolean }) => {
  return (
    <Group position="apart" {...rest}>
      <Group spacing={6}>
        <UserDetailsAvatar size={isReply ? 28 : 36} />
        <UserDetailsDisplayName ml={6} size="sm" />
        <UserDetailsName />
        <RelativeTime />
      </Group>
      <NoteActionMore size={16} />
    </Group>
  );
};

const CommentContent = () => {
  const { event } = useEvent();

  return <NoteContent fz="sm" ml={46} content={event.content} />;
};

const CommentActions = () => {
  return (
    <Group spacing={12} ml={46}>
      <Button fz={13} variant="subtle" c="purple.0" py={4} px={16} mih={0}>
        Reply
      </Button>
      <NoteActionLike size={16} c="white" />
      <NoteActionZap size={16} c="white" />
    </Group>
  );
};

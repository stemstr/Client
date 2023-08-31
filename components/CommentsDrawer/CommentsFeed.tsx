import { Box, Center, Loader, Text } from "@mantine/core";
import { useComments } from "ndk/NDKCommentsProvider";

export default function CommentsFeed() {
  const { comments } = useComments();
  return (
    <Box
      h={375}
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.colors.gray[6]}`,
      })}
    >
      {comments ? (
        comments.map((comment) => (
          <Text>
            {comment.event.content} ({comment.children.length})
          </Text>
        ))
      ) : (
        <Center w="100%" h="100%">
          <Loader />
        </Center>
      )}
    </Box>
  );
}

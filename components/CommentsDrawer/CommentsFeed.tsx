import { Box, Center, Loader } from "@mantine/core";
import { useComments } from "ndk/NDKCommentsProvider";
import CommentGroup from "./CommentGroup";

export default function CommentsFeed() {
  const { comments } = useComments();
  return (
    <Box
      h={375}
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.colors.gray[6]}`,
        overflowY: "scroll",
      })}
    >
      {comments ? (
        comments.map((comment) => (
          <CommentGroup key={comment.event.id} comment={comment} />
        ))
      ) : (
        <Center w="100%" h="100%">
          <Loader />
        </Center>
      )}
    </Box>
  );
}

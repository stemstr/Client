import { Box, Center, Loader, Stack, Text } from "@mantine/core";
import { useComments } from "ndk/NDKCommentsProvider";
import CommentGroup from "./CommentGroup";
import { use, useEffect, useState } from "react";
import { StarLineIcon, StarSolidIcon, StemIcon } from "icons/StemstrIcon";

export default function CommentsFeed() {
  const { comments } = useComments();
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  useEffect(() => {
    const initialLoadTimeout = setTimeout(() => {
      setIsInitialLoadComplete(true);
    }, 2000);

    return () => {
      clearTimeout(initialLoadTimeout);
    };
  }, []);

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
          {isInitialLoadComplete ? (
            <CommentsFeedNullState></CommentsFeedNullState>
          ) : (
            <Loader />
          )}
        </Center>
      )}
    </Box>
  );
}

const CommentsFeedNullState = () => {
  return (
    <Stack align="center" spacing={0} maw={264} ta="center">
      <Center p="md" mb={48} pos="relative">
        <StemIcon color="#865AE2" width={80} height={80} />
        <Box c="green.5" pos="absolute" top={12} left={0}>
          <StarSolidIcon width={14} height={14} />
        </Box>
        <Box c="orange.5" pos="absolute" top={12} left={24}>
          <StarLineIcon width={12} height={12} />
        </Box>
        <Box c="green.5" pos="absolute" top={8} right={8}>
          <StarSolidIcon width={16} height={16} />
        </Box>
        <Box c="orange.5" pos="absolute" top={20} right={-4}>
          <StarLineIcon width={12} height={12} />
        </Box>
        <Box c="green.5" pos="absolute" bottom={8} left={32}>
          <StarSolidIcon width={12} height={12} />
        </Box>
        <Box c="orange.5" pos="absolute" bottom={-4} left={44}>
          <StarLineIcon width={14} height={14} />
        </Box>
        <Box c="green.5" pos="absolute" bottom={8} right={12}>
          <StarSolidIcon width={12} height={12} />
        </Box>
      </Center>
      <Text mb={8} c="white" fz="lg" fw="bold">
        It’s too quiet here!
      </Text>
      <Text fz="sm" c="gray.1">
        Be the first to share your thoughts on this by adding a comment
      </Text>
    </Stack>
  );
};

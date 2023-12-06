import { Box, Group, Text } from "@mantine/core";
import Drawer, { DrawerProps } from "components/Drawer/Drawer";
import CommentsFeed from "./CommentsFeed";
import { useEvent } from "ndk/NDKEventProvider";
import { CommentsProvider, useComments } from "ndk/NDKCommentsProvider";
import CommentForm from "./CommentForm";
import { isMobile } from "react-device-detect";

export default function CommentsDrawer(props: DrawerProps) {
  const { event } = useEvent();

  return (
    <Drawer {...props}>
      <CommentsProvider rootEvent={event} enabled={props.opened}>
        <CommentsDrawerHeader />
        {isMobile ? (
          <>
            <CommentForm />
            <CommentsFeed />
          </>
        ) : (
          <>
            <CommentsFeed />
            <CommentForm />
          </>
        )}
      </CommentsProvider>
    </Drawer>
  );
}

const CommentsDrawerHeader = () => {
  const { comments } = useComments();
  const commentsCount =
    (comments?.length ?? 0) +
    (comments?.reduce((prev, curr) => prev + curr.children.length, 0) ?? 0);

  return (
    <Box
      pb="md"
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.colors.gray[6]}`,
      })}
    >
      <Group
        position="center"
        spacing={12}
        c="white"
        fz={20}
        fw="bold"
        ta="center"
      >
        Comments{" "}
        {comments && (
          <Text
            fz="sm"
            fw={500}
            lh={1.16}
            py={4}
            px={8}
            bg="gray.4"
            sx={{ borderRadius: 12 }}
            span
          >
            {commentsCount}
          </Text>
        )}
      </Group>
    </Box>
  );
};

import { Avatar, Box, Group, Text, TextInput } from "@mantine/core";
import Drawer, { DrawerProps } from "components/Drawer/Drawer";
import useAuth from "hooks/useAuth";
import useProfilePicSrc from "ndk/hooks/useProfilePicSrc";
import { useUser } from "ndk/hooks/useUser";
import CommentsFeed from "./CommentsFeed";
import { useEvent } from "ndk/NDKEventProvider";
import { CommentsProvider, useComments } from "ndk/NDKCommentsProvider";

export default function CommentsDrawer(props: DrawerProps) {
  const { authState } = useAuth();
  const user = useUser(authState.pk);
  const src = useProfilePicSrc(user);
  const { event } = useEvent();

  return (
    <Drawer {...props}>
      <CommentsProvider noteId={event.id} enabled={props.opened}>
        <CommentsDrawerHeader />
        <CommentsFeed />
        <Group spacing="sm" px="md" py={8}>
          <Avatar
            src={user?.profile?.image || src}
            alt={user?.profile?.name}
            size={36}
            radius={18}
            sx={(theme) => ({
              border: `1px solid ${theme.colors.gray[4]}`,
            })}
          />
          <TextInput placeholder="Add your comment" sx={{ flexGrow: 1 }} />
        </Group>
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

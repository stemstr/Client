import NoteAction from "./NoteAction";
import { CheckIcon, RepostIcon } from "../../icons/StemstrIcon";
import { useDisclosure } from "@mantine/hooks";
import { Button, Center, Drawer, Group, Stack, Text } from "@mantine/core";
import { useEvent } from "ndk/NDKEventProvider";
import { useNDK } from "ndk/NDKProvider";
import { createRepostEvent } from "ndk/utils";
import { selectNoteState, setIsRepostedByCurrentUser } from "store/Notes";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "store/Store";
import useAuth from "hooks/useAuth";

export default function NoteActionRepost() {
  const { ndk, stemstrRelaySet } = useNDK();
  const { event } = useEvent();
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useDispatch();
  const { isRepostedByCurrentUser, repostCount } = useSelector(
    (state: AppState) => selectNoteState(state, event.id)
  );
  const { guardAuth, guardSubscribed } = useAuth();

  const handleClick = () => {
    if (!guardAuth()) return;
    if (!guardSubscribed()) return;

    open();
  };

  const handleRepost = () => {
    if (ndk) {
      const repostEvent = createRepostEvent(ndk, event);
      repostEvent.publish(stemstrRelaySet).then(() => {
        dispatch(setIsRepostedByCurrentUser({ id: event.id, value: true }));
        close();
      });
    }
  };

  return (
    <>
      <Drawer
        onClick={(event) => event.stopPropagation()}
        opened={opened}
        onClose={close}
        title="Ready to repost?"
        position="bottom"
        size="auto"
        padding="md"
        styles={(theme) => ({
          header: {
            marginTop: theme.spacing.md,
          },
          title: {
            margin: "auto",
            fontWeight: "bold",
            fontSize: theme.fontSizes.xl,
          },
          closeButton: { display: "none" },
          drawer: {
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: theme.colors.dark[8],
            color: theme.white,
            boxShadow: `0px -4px 4px ${theme.fn.rgba("black", 0.25)}`,
            maxWidth: 600,
            margin: "auto",
          },
          body: {
            fontWeight: 500,
          },
        })}
      >
        <Stack spacing="md" mb="md">
          <Group
            onClick={handleRepost}
            sx={(theme) => ({
              padding: theme.spacing.md,
              cursor: "pointer",
            })}
          >
            <Center
              sx={(theme) => ({
                borderRadius: theme.radius.xl,
                backgroundColor: theme.colors.dark[7],
                width: 32,
                height: 32,
              })}
            >
              <CheckIcon width={16} height={16} />
            </Center>
            <Text>Yep, repost this 🔥</Text>
          </Group>
        </Stack>
        <Button
          onClick={close}
          variant="subtle"
          c="white"
          fz="md"
          fullWidth
          sx={(theme) => ({
            borderTop: `1px solid ${theme.colors.gray[4]}`,
            maxWidth: 390,
            borderRadius: 0,
            margin: "auto",
            display: "block",
            height: 58,
          })}
        >
          Close
        </Button>
      </Drawer>
      <NoteAction onClick={handleClick}>
        <Group
          position="center"
          spacing={6}
          sx={(theme) => ({
            transition: "color 1s ease",
            color: isRepostedByCurrentUser
              ? theme.colors.green[5]
              : theme.colors.gray[1],
          })}
          noWrap
        >
          <RepostIcon width={18} height={18} />
          {repostCount > 0 && <Text lh="normal">{repostCount}</Text>}
        </Group>
      </NoteAction>
    </>
  );
}

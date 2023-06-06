import { Button, Center, Drawer, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BracketsEllipsesIcon, MoreIcon } from "icons/StemstrIcon";
import withStopClickPropagation from "utils/hoc/withStopClickPropagation";
import { useEvent } from "../../ndk/NDKEventProvider";

const NoteActionMore = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Options"
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
          <NoteActionMoreCopyRawEvent onDone={close} />
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
      <Center onClick={open} sx={(theme) => ({ cursor: "pointer" })}>
        <MoreIcon width={24} height={24} />
      </Center>
    </>
  );
};

const NoteActionMoreCopyRawEvent = ({ onDone }: { onDone: () => void }) => {
  const { event } = useEvent();
  const handleClick = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(event.rawEvent()));
      onDone();
    }
  };

  return (
    <Group
      onClick={handleClick}
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
        <BracketsEllipsesIcon width={16} height={16} />
      </Center>
      <Text>Copy Raw Event</Text>
    </Group>
  );
};

export default withStopClickPropagation(NoteActionMore);

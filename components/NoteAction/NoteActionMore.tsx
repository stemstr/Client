import {
  Button,
  Center,
  CopyButton,
  Drawer,
  Group,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  BracketsEllipsesIcon,
  CheckCircleIcon,
  MoreIcon,
  ShareIcon,
} from "icons/StemstrIcon";
import { useEvent } from "../../ndk/NDKEventProvider";
import { selectUserPreferencesState } from "store/UserPreferences";
import { useSelector } from "react-redux";
import { MouseEvent } from "react";

type NoteActionMoreProps = {
  size: number;
};

const NoteActionMore = ({ size = 24 }: NoteActionMoreProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { userPreferences } = useSelector(selectUserPreferencesState);

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
          <NoteActionMoreShare />
          {userPreferences.isDeveloperModeEnabled && (
            <NoteActionMoreCopyRawEvent />
          )}
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
      <Center
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          open();
        }}
        sx={(theme) => ({ cursor: "pointer" })}
      >
        <MoreIcon width={size} height={size} />
      </Center>
    </>
  );
};

const NoteActionMoreCopyRawEvent = () => {
  const { event } = useEvent();

  return (
    <CopyButton value={JSON.stringify(event.rawEvent())}>
      {({ copied, copy }) => (
        <Group
          onClick={copy}
          sx={(theme) => ({
            paddingLeft: theme.spacing.md,
            paddingRight: theme.spacing.md,
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
          <Group spacing={6}>
            {copied ? (
              <>
                Copied <CheckCircleIcon width={16} height={16} />
              </>
            ) : (
              "Copy Raw Event"
            )}
          </Group>
        </Group>
      )}
    </CopyButton>
  );
};

const NoteActionMoreShare = () => {
  const { event } = useEvent();
  const url = `https://stemstr.app/thread/${event.id}`;
  const canShare = Boolean(navigator.share);

  const handleClick = () => {
    if (canShare) {
      const shareData = {
        title: "Share note",
        url: url,
      };

      // Trigger the system share sheet
      navigator
        .share(shareData)
        .then(() => {
          console.log("Successfully shared");
        })
        .catch((error) => {
          console.log("Error sharing:", error);
        });
    }
  };

  return (
    <CopyButton value={url}>
      {({ copied, copy }) => (
        <Group
          onClick={canShare ? handleClick : copy}
          sx={(theme) => ({
            paddingLeft: theme.spacing.md,
            paddingRight: theme.spacing.md,
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
            <ShareIcon width={16} height={16} />
          </Center>
          <Group spacing={6}>
            {canShare ? (
              "Share Note"
            ) : copied ? (
              <>
                Copied <CheckCircleIcon width={16} height={16} />
              </>
            ) : (
              "Copy Note URL"
            )}
          </Group>
        </Group>
      )}
    </CopyButton>
  );
};

export default NoteActionMore;

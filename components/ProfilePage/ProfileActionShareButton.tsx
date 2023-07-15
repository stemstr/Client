import {
  Box,
  Button,
  Center,
  CopyButton,
  Drawer,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ProfileActionButton from "components/ProfileActionButton/ProfileActionButton";
import { ShareIcon } from "icons/StemstrIcon";
import { useUser } from "ndk/hooks/useUser";
import ProfilePic from "./ProfilePic";
import QRCode from "qrcode.react";
import Blur1 from "icons/Other/blur-1.svg";
import Blur2 from "icons/Other/blur-2.svg";
import Blur3 from "icons/Other/blur-3.svg";
import { CheckCircleIcon } from "icons/StemstrIcon";

export default function ProfileActionShareButton({
  pubkey,
}: {
  pubkey: string;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const user = useUser(pubkey);
  const url = `https://stemstr.app/user/${pubkey}`;

  const handleShareClick = () => {
    if (navigator.share) {
      // Define the data you want to share
      const shareData = {
        title: "Share profile",
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
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Share profile"
        position="bottom"
        size="auto"
        padding={24}
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
        <Box
          sx={(theme) => ({
            borderRadius: theme.radius.lg,
            overflow: "hidden",
          })}
        >
          <Image
            src={user?.profile?.banner}
            h={108}
            sx={{ overflow: "hidden" }}
          />
          <Stack align="center" p={24} pt={0} spacing={0} bg="dark.7">
            <ProfilePic pubkey={pubkey} size={62} />
            <Text fz="md" fw="bold" mt={12}>
              {user?.profile?.displayName
                ? user?.profile?.displayName
                : user?.profile?.name}
            </Text>
            {user?.profile?.displayName && (
              <Text fw={400} fz="xs" c="gray.1">
                @{user?.profile?.name}
              </Text>
            )}
            <Text fw={400} mt={4} fz="xs" truncate>
              {user?.profile?.about}
            </Text>
            <Box mt={16} pos="relative">
              <Box
                bg="dark.7"
                pos="relative"
                p={5}
                lh={0}
                sx={(theme) => ({
                  zIndex: 1,
                  border: `1px solid ${theme.colors.gray[4]}`,
                  borderRadius: 12,
                })}
              >
                <QRCode size={112} value={url} />
              </Box>
              <Center pos="absolute" w={260} h={208} top={-42} left={-68}>
                <Blur1 />
              </Center>
              <Center pos="absolute" w={260} h={208} top={-42} left={-68}>
                <Blur2 />
              </Center>
              <Center pos="absolute" w={227} h={227} top={-52} left={-52}>
                <Blur3 />
              </Center>
            </Box>
            <Text fw="bold" fz="xs" mt={14}>
              Scan to follow me on stemstr
            </Text>
            {Boolean(navigator.share) ? (
              <Button
                onClick={handleShareClick}
                rightIcon={<ShareIcon width={16} height={16} />}
                mt={16}
                fullWidth
                variant="light"
              >
                Share with your friends
              </Button>
            ) : (
              <CopyButton value={url}>
                {({ copied, copy }) => (
                  <Button
                    rightIcon={
                      copied && <CheckCircleIcon width={16} height={16} />
                    }
                    mt={16}
                    color="gray.6"
                    onClick={copy}
                    fullWidth
                  >
                    {copied ? "Copied" : "Copy Profile URL"}
                  </Button>
                )}
              </CopyButton>
            )}
          </Stack>
        </Box>
      </Drawer>
      <ProfileActionButton onClick={open}>
        <ShareIcon width={16} height={16} />
      </ProfileActionButton>
    </>
  );
}

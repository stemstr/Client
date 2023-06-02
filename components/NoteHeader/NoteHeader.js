import { Anchor, Avatar, Center, Group, Text, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { MoreIcon, VerifiedIcon } from "../../icons/StemstrIcon";
import DownloadSoundButton from "../DownloadSoundButton/DownloadSoundButton";
import Link from "next/link";
import withStopClickPropagation from "../../utils/hoc/withStopClickPropagation";
import { getRelativeTimeString } from "../../ndk/utils";

const UserDetailsAnchorWrapper = ({ note, children }) => (
  <Anchor
    component={Link}
    href={`/user/${note.event.pubkey}`}
    sx={{
      ":hover": {
        textDecoration: "none",
      },
    }}
  >
    {children}
  </Anchor>
);

const UserDetailsAvatar = ({ userData }) => (
  <Avatar src={userData?.image} alt={userData?.name} size={42} radius="50%" />
);

const UserDetailsDisplayName = ({ note, userData, ...rest }) => (
  <Text color="white" {...rest}>
    {userData?.displayName
      ? userData.displayName
      : `@${note.event.pubkey.substring(0, 5)}...`}
  </Text>
);

const UserDetailsName = ({ userData }) => (
  <Text size="xs" color="rgba(255, 255, 255, 0.74)">
    {userData?.name ? `@${userData.name}` : ""}
  </Text>
);

const RelativeTime = ({ note, ...rest }) => (
  <Text size="sm" color="rgba(255, 255, 255, 0.38)" {...rest}>
    · {getRelativeTimeString(note.event.created_at)}
  </Text>
);

const DesktopUserDetails = ({ note, userData }) => (
  <Group spacing={6}>
    <UserDetailsAnchorWrapper note={note}>
      <Group spacing={6}>
        <UserDetailsAvatar userData={userData} />
        <UserDetailsDisplayName size="lg" note={note} userData={userData} />
        <VerifiedIcon width={14} height={14} />
        <UserDetailsName userData={userData} />
      </Group>
    </UserDetailsAnchorWrapper>
    <RelativeTime note={note} />
  </Group>
);

const MobileUserDetails = ({ note, userData }) => (
  <Group spacing={6} sx={{ alignItems: "flex-start" }}>
    <UserDetailsAnchorWrapper note={note}>
      <Group spacing={6} alignItems="flex-start">
        <UserDetailsAvatar userData={userData} />
        <Stack spacing={0}>
          <Group spacing={6}>
            <UserDetailsDisplayName size="sm" note={note} userData={userData} />
            <VerifiedIcon width={14} height={14} />
          </Group>
          <UserDetailsName userData={userData} />
        </Stack>
      </Group>
    </UserDetailsAnchorWrapper>
    <RelativeTime note={note} mt={1} />
  </Group>
);

const NoteHeader = ({
  note,
  userData,
  downloadUrl,
  downloadStatus,
  setDownloadStatus,
}) => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const UserDetails = isSmallScreen ? MobileUserDetails : DesktopUserDetails;

  return (
    <Group position="apart">
      <UserDetails note={note} userData={userData} />
      <Group position="right">
        <DownloadSoundButton
          href={downloadUrl}
          downloadStatus={downloadStatus}
          setDownloadStatus={setDownloadStatus}
        />
        <Center
          sx={(theme) => ({
            width: 28,
            height: 28,
            color: theme.colors.gray[2],
          })}
        >
          <MoreIcon width={24} height={24} />
        </Center>
      </Group>
    </Group>
  );
};

export default withStopClickPropagation(NoteHeader);

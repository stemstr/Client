import { Anchor, Avatar, Center, Group, Text, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { VerifiedIcon } from "../../icons/StemstrIcon";
import DownloadSoundButton from "../DownloadSoundButton/DownloadSoundButton";
import Link from "next/link";
import withStopClickPropagation from "../../utils/hoc/withStopClickPropagation";
import { getNormalizedName, getRelativeTimeString } from "../../ndk/utils";
import NoteActionMore from "components/NoteAction/NoteActionMore";
import { useEvent } from "../../ndk/NDKEventProvider";
import { useUser } from "ndk/hooks/useUser";
import useNip05 from "ndk/hooks/useNip05";
import { Nip05Status } from "store/Nip05";
import useProfilePicSrc from "ndk/hooks/useProfilePicSrc";

const UserDetailsAnchorWrapper = ({ children }) => {
  const { event } = useEvent();

  return (
    <Anchor
      component={Link}
      href={`/user/${event.pubkey}`}
      sx={{
        ":hover": {
          textDecoration: "none",
        },
        overflow: "hidden",
      }}
    >
      <Group spacing={6} sx={{ flexWrap: "nowrap" }}>
        {children}
      </Group>
    </Anchor>
  );
};

const UserDetailsNip05 = () => {
  const { event } = useEvent();
  const user = useUser(event.pubkey);
  const nip05Status = useNip05(event.pubkey, user?.profile?.nip05);

  return nip05Status === Nip05Status.Valid ? (
    <VerifiedIcon width={14} height={14} />
  ) : null;
};

const UserDetailsAvatar = () => {
  const { event } = useEvent();
  const user = useUser(event.pubkey);
  const src = useProfilePicSrc(user);

  return <Avatar src={src} alt={user?.profile?.name} size={42} radius="50%" />;
};

const UserDetailsDisplayName = (props) => {
  const { event } = useEvent();
  const user = useUser(event.pubkey);

  return (
    <Text color="white" fw={500} truncate {...props}>
      {getNormalizedName(event.pubkey, user)}
    </Text>
  );
};

const UserDetailsName = (props) => {
  const { event } = useEvent();
  const user = useUser(event.pubkey);
  const willDisplay = user?.profile?.name && user?.profile?.displayName;

  return (
    <Text
      size="xs"
      color="rgba(255, 255, 255, 0.74)"
      {...props}
      display={willDisplay ? undefined : "none"}
    >
      {willDisplay ? `@${user?.profile?.name}` : ""}
    </Text>
  );
};

const RelativeTime = (props) => {
  const { event } = useEvent();

  return (
    <Text
      size="sm"
      color="rgba(255, 255, 255, 0.38)"
      sx={{ whiteSpace: "nowrap" }}
      {...props}
    >
      · {getRelativeTimeString(event.created_at)}
    </Text>
  );
};

const SingleRowUserDetails = ({ sx }) => (
  <Group spacing={6} sx={sx}>
    <UserDetailsAnchorWrapper>
      <UserDetailsAvatar />
      <UserDetailsDisplayName size="lg" />
      <UserDetailsNip05 />
      <UserDetailsName />
    </UserDetailsAnchorWrapper>
    <RelativeTime />
  </Group>
);

const DoubleRowUserDetails = ({ sx }) => {
  const isReallySmallScreen = useMediaQuery("(max-width: 400px)");
  const nameStyles = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flex: 1,
    maxWidth: isReallySmallScreen ? 140 : "auto",
  };
  const { event } = useEvent();
  const user = useUser(event.pubkey);
  const hasUserName = Boolean(user?.profile?.name);

  return (
    <Group
      spacing={6}
      sx={{ ...sx, alignItems: hasUserName ? "flex-start" : "center" }}
    >
      <UserDetailsAnchorWrapper>
        <UserDetailsAvatar />
        <Stack spacing={0} sx={{ overflow: "hidden" }}>
          <Group spacing={6}>
            <UserDetailsDisplayName size="sm" sx={nameStyles} />
            <UserDetailsNip05 />
            <RelativeTime mt={hasUserName ? 1 : 0} />
          </Group>
          <UserDetailsName sx={nameStyles} />
        </Stack>
      </UserDetailsAnchorWrapper>
    </Group>
  );
};

const UserDetails = ({ sx }) => {
  const isScreenSmallOnInitialLoad = document.documentElement.clientWidth < 600;
  const isSmallScreen = useMediaQuery(
    "(max-width: 600px)",
    isScreenSmallOnInitialLoad,
    {
      getInitialValueInEffect: !isScreenSmallOnInitialLoad,
    }
  );
  const { event } = useEvent();
  const user = useUser(event.pubkey);
  const UserDetailsComponent =
    isSmallScreen && user?.profile?.name && user?.profile?.displayName
      ? DoubleRowUserDetails
      : SingleRowUserDetails;

  return (
    <UserDetailsComponent
      sx={{ flexWrap: "nowrap", overflow: "hidden", ...sx }}
    />
  );
};

const NoteHeader = ({ downloadUrl }) => (
  <Group position="apart" sx={{ flexWrap: "nowrap" }}>
    <UserDetails sx={{ flexWrap: "nowrap", overflow: "hidden" }} />
    <Group spacing={8} position="right" sx={{ minWidth: 68, flexShrink: 0 }}>
      <DownloadSoundButton href={downloadUrl} />
      <Center
        sx={(theme) => ({
          width: 24,
          height: 24,
          color: theme.colors.gray[2],
        })}
      >
        <NoteActionMore />
      </Center>
    </Group>
  </Group>
);

export default withStopClickPropagation(NoteHeader);

import { Anchor, Avatar, Center, Group, Text, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { VerifiedIcon } from "../../icons/StemstrIcon";
import DownloadSoundButton from "../DownloadSoundButton/DownloadSoundButton";
import Link from "next/link";
import withStopClickPropagation from "../../utils/hoc/withStopClickPropagation";
import { getRelativeTimeString } from "../../ndk/utils";
import NoteActionMore from "components/NoteAction/NoteActionMore";
import { useEvent } from "../../ndk/NDKEventProvider";
import { useUser } from "ndk/hooks/useUser";
import useNip05 from "ndk/hooks/useNip05";
import { Nip05Status } from "store/Nip05";

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

const UserDetailsNip05 = ({ userData }) => {
  const { event } = useEvent();
  const nip05Status = useNip05(event.pubkey, userData?.nip05);

  return nip05Status === Nip05Status.Valid ? (
    <VerifiedIcon width={14} height={14} />
  ) : null;
};

const UserDetailsAvatar = ({ userData }) => (
  <Avatar src={userData?.image} alt={userData?.name} size={42} radius="50%" />
);

const UserDetailsDisplayName = ({ userData, ...rest }) => {
  const { event } = useEvent();

  return (
    <Text color="white" {...rest}>
      {userData?.displayName
        ? userData.displayName
        : `@${event.pubkey.substring(0, 5)}...`}
    </Text>
  );
};

const UserDetailsName = ({ userData, ...rest }) => (
  <Text size="xs" color="rgba(255, 255, 255, 0.74)" {...rest}>
    {userData?.name ? `@${userData.name}` : ""}
  </Text>
);

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

const DesktopUserDetails = ({ userData, sx }) => (
  <Group spacing={6} sx={sx}>
    <UserDetailsAnchorWrapper>
      <UserDetailsAvatar userData={userData} />
      <UserDetailsDisplayName size="lg" userData={userData} />
      <UserDetailsNip05 userData={userData} />
      <UserDetailsName userData={userData} />
    </UserDetailsAnchorWrapper>
    <RelativeTime />
  </Group>
);

const MobileUserDetails = ({ userData, sx }) => {
  const isReallySmallScreen = useMediaQuery("(max-width: 400px)");
  const nameStyles = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flex: 1,
    maxWidth: isReallySmallScreen ? 140 : "auto",
  };
  const hasUserName = Boolean(userData?.name);

  return (
    <Group
      spacing={6}
      sx={{ ...sx, alignItems: hasUserName ? "flex-start" : "center" }}
    >
      <UserDetailsAnchorWrapper>
        <UserDetailsAvatar userData={userData} />
        <Stack spacing={0} sx={{ overflow: "hidden" }}>
          <Group spacing={6}>
            <UserDetailsDisplayName
              size="sm"
              userData={userData}
              sx={nameStyles}
            />
            <UserDetailsNip05 userData={userData} />
          </Group>
          <UserDetailsName userData={userData} sx={nameStyles} />
        </Stack>
      </UserDetailsAnchorWrapper>
      <RelativeTime mt={hasUserName ? 1 : 0} />
    </Group>
  );
};

const UserDetails = ({ userData, sx }) => {
  const isScreenSmallOnInitialLoad = document.documentElement.clientWidth < 600;
  const isSmallScreen = useMediaQuery(
    "(max-width: 600px)",
    isScreenSmallOnInitialLoad,
    {
      getInitialValueInEffect: !isScreenSmallOnInitialLoad,
    }
  );
  const UserDetailsComponent = isSmallScreen
    ? MobileUserDetails
    : DesktopUserDetails;

  return (
    <UserDetailsComponent
      userData={userData}
      sx={{ flexWrap: "nowrap", overflow: "hidden", ...sx }}
    />
  );
};

const NoteHeader = ({ downloadUrl }) => {
  const { event } = useEvent();
  const user = useUser(event.pubkey);

  return (
    <Group position="apart" sx={{ flexWrap: "nowrap" }}>
      <UserDetails
        userData={user?.profile}
        sx={{ flexWrap: "nowrap", overflow: "hidden" }}
      />
      <Group position="right" sx={{ minWidth: 68 }}>
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
};
export default withStopClickPropagation(NoteHeader);

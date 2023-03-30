import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Group,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useProfile } from "../../nostr/hooks/useProfile";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState, reset as logout } from "../../store/Auth";
import { getPublicKeys } from "../../nostr/utils";
import {
  SettingsIcon,
  ZapIcon,
  ShareIcon,
  EditIcon,
  VerifiedIcon,
} from "../../icons/StemstrIcon";
import ProfileActionButton from "../../components/ProfileActionButton/ProfileActionButton";
import useContactList from "../../nostr/hooks/useContactList";
import CopyNpub from "../../components/CopyNpub/CopyNpub";
import ProfileFeed from "../../components/ProfileFeed/ProfileFeed";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { hexOrNpub } = router.query;
  const { pk, npub } = useMemo(() => getPublicKeys(hexOrNpub), [hexOrNpub]);
  const authState = useSelector(selectAuthState);
  const { data: userData, nip05 } = useProfile({
    pubkey: pk,
  });
  const { contactList, relayList } = useContactList({
    pubkey: pk,
  });

  useEffect(() => {
    // console.log(userData);
  }, [userData]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          margin: `-${theme.spacing.md}px -${theme.spacing.md}px 0`,
          padding: `${theme.spacing.md}px ${theme.spacing.md}px 0`,
          height: 200,
        })}
      >
        {userData?.banner && (
          <Image
            src={userData.banner}
            height={200}
            styles={(theme) => ({
              root: {
                position: "absolute",
                zIndex: -1,
                top: 0,
                left: 0,
                right: 0,
              },
              imageWrapper: {
                position: "static",
              },
            })}
          />
        )}
        <Group position="apart">
          <Text c="white" fw="bold" fz={24}>
            Profile
          </Text>
          <Group spacing={20}>
            <ActionIcon variant="default" color="white">
              <SettingsIcon width={24} height={24} />
            </ActionIcon>
          </Group>
        </Group>
      </Box>
      <Group mb="lg" position="apart" mt={-50}>
        <Avatar
          src={userData?.picture}
          alt={userData?.name}
          size={100}
          radius="50%"
        />
        <Group>
          <ProfileActionButton>
            <ShareIcon width={13} height={13} />
          </ProfileActionButton>
          <ProfileActionButton>
            <ZapIcon width={13} height={13} />
          </ProfileActionButton>
          <ProfileActionButton>
            <EditIcon width={13} height={13} />
            <Text lh="normal" ml={8}>
              Edit Profile
            </Text>
          </ProfileActionButton>
        </Group>
      </Group>
      <Stack spacing={6} mb="xl" c="white">
        <Text size="lg" color="white" fw="bold">
          {userData?.display_name
            ? userData.display_name
            : `@${userData?.pk?.substring(0, 5)}...`}
        </Text>
        <Group spacing={4}>
          <Text size="sm">{userData?.name && `@${userData.name}`}</Text>
          {nip05 && (
            <>
              <VerifiedIcon width={14} height={14} />
              <Text size="sm" color="purple.2">
                {userData?.nip05 &&
                  userData.nip05.slice(userData.nip05.indexOf("@") + 1)}
              </Text>
            </>
          )}
        </Group>
        <Text size="sm" mb={8} sx={{ whiteSpace: "pre-wrap" }}>
          {userData?.about}
        </Text>
        <CopyNpub npub={npub} />
      </Stack>
      <Group
        spacing="xl"
        position="center"
        sx={(theme) => ({
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.sm,
          marginLeft: -theme.spacing.md,
          marginRight: -theme.spacing.md,
          marginBottom: theme.spacing.md,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          borderStyle: "solid",
          borderColor: theme.fn.rgba(theme.colors.gray[0], 0.1),
          fontSize: 14,
          color: theme.white,
        })}
      >
        <Text>
          <Text span fw="700">
            {contactList ? contactList.tags.length : 0}
          </Text>{" "}
          following
        </Text>
        <Text>
          <Text span fw="700">
            ?
          </Text>{" "}
          followers
        </Text>
        <Text>
          <Text span fw="700">
            {Object.keys(relayList).length}
          </Text>{" "}
          relays
        </Text>
      </Group>
      {authState?.user?.npub === npub ? (
        <Button onClick={handleLogout} mb="md">
          Logout
        </Button>
      ) : null}
      <ProfileFeed pubkey={pk} />
    </>
  );
}

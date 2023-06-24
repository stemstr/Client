import { useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { selectAuthState, reset as logout } from "store/Auth";
import { Route } from "enums/routes";
import { getPublicKeys } from "ndk/utils";
import CopyNpub from "components/CopyNpub/CopyNpub";
import ProfileFeed from "components/ProfileFeed/ProfileFeed";
import BackButton from "components/BackButton/BackButton";
import { SettingsIcon, VerifiedIcon, ChevronLeftIcon } from "icons/StemstrIcon";
import { useUser } from "ndk/hooks/useUser";
import ProfilePic from "components/ProfilePage/ProfilePic";
import ProfileActionButtons from "components/ProfilePage/ProfileActionButtons";
import { Nip05Status, getNip05Status } from "ndk/inMemoryCacheAdapter";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { hexOrNpub } = router.query;
  const { pk, npub } = useMemo(
    () => getPublicKeys(hexOrNpub as string),
    [hexOrNpub]
  );
  const authState = useSelector(selectAuthState);
  const user = useUser(pk);
  const [nip05Status, setNip05Status] = useState<Nip05Status>();

  const handleLogout = () => {
    dispatch(logout());
    router.push(Route.Login);
  };

  useEffect(() => {
    if (user?.profile?.nip05) {
      getNip05Status(user?.profile?.nip05, pk).then((status) => {
        setNip05Status(status);
      });
    }
  }, [user?.profile?.nip05]);

  return (
    <>
      <Head>
        <title>{`Stemstr - ${user?.profile?.displayName || "Profile"}`}</title>
      </Head>
      <Box
        sx={(theme) => ({
          padding: `${theme.spacing.md}px ${theme.spacing.md}px 0`,
          height: 200,
        })}
      >
        {user?.profile?.banner && (
          <Image
            src={user.profile.banner}
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
          <Group spacing="sm" align="center" c="white">
            <BackButton defaultUrl={Route.Home}>
              <ChevronLeftIcon width={24} height={24} />
            </BackButton>
            <Text c="white" fw="bold" fz={24} lh="normal">
              Profile
            </Text>
          </Group>
          <Group spacing={20}>
            <ActionIcon variant="default" color="white">
              <SettingsIcon width={24} height={24} />
            </ActionIcon>
          </Group>
        </Group>
      </Box>
      <Group pl="md" pr="md" mb="lg" position="apart" align="start">
        <ProfilePic pubkey={pk} />
        <ProfileActionButtons pubkey={pk} />
      </Group>
      <Stack spacing={6} mb="xl" pl="md" pr="md" c="white">
        <Text size="lg" color="white" fw="bold">
          {user?.profile?.displayName
            ? user.profile.displayName
            : `@${pk.substring(0, 5)}...`}
        </Text>
        <Group spacing={4}>
          <Text size="sm">
            {user?.profile?.name && `@${user?.profile.name}`}
          </Text>
          {nip05Status === Nip05Status.Valid && (
            <>
              <VerifiedIcon width={14} height={14} />
              <Text size="sm" color="purple.2">
                {user?.profile?.nip05 && user.profile.nip05.split("@")[1]}
              </Text>
            </>
          )}
        </Group>
        <Text size="sm" mb={8} sx={{ whiteSpace: "pre-wrap" }}>
          {user?.profile?.about}
        </Text>
        <CopyNpub npub={npub} />
      </Stack>
      <Group
        spacing="xl"
        position="center"
        sx={(theme) => ({
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.sm,
          marginBottom: theme.spacing.md,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          borderStyle: "solid",
          borderColor: theme.fn.rgba(theme.colors.gray[0], 0.1),
          fontSize: 14,
          color: theme.white,
          [theme.fn.largerThan("sm")]: {
            marginLeft: -theme.spacing.md,
            marginRight: -theme.spacing.md,
          },
        })}
      >
        <Text>
          <Text span fw={700}>
            0
          </Text>{" "}
          following
        </Text>
        <Text>
          <Text span fw={700}>
            ?
          </Text>{" "}
          followers
        </Text>
        <Text>
          <Text span fw={700}>
            0
          </Text>{" "}
          relays
        </Text>
      </Group>
      <Box pl="md" pr="md">
        {authState?.pk === pk ? (
          <Button onClick={handleLogout} mb="md">
            Logout
          </Button>
        ) : null}
        <ProfileFeed pubkey={pk} />
      </Box>
    </>
  );
}

import { useMemo, useRef, useState } from "react";
import { ActionIcon, Box, Group, Image, Stack, Text } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";

import { Route } from "enums/routes";
import { getPublicKeys } from "ndk/utils";
import CopyNpub from "components/CopyNpub/CopyNpub";
import ProfileFeed from "components/ProfileFeed/ProfileFeed";
import BackButton from "components/BackButton/BackButton";
import { SettingsIcon, VerifiedIcon, ChevronLeftIcon } from "icons/StemstrIcon";
import { useUser } from "ndk/hooks/useUser";
import ProfilePic from "components/ProfilePage/ProfilePic";
import ProfileActionButtons from "components/ProfilePage/ProfileActionButtons";
import useNip05 from "ndk/hooks/useNip05";
import { Nip05Status } from "store/Nip05";
import Link from "next/link";
import ProfileContactsBar from "components/ProfilePage/ProfileContactsBar";
import useFooterHeight from "ndk/hooks/useFooterHeight";
import SubscriptionStatusDrawer from "components/ProfilePage/SubscriptionStatusDrawer";
import { useSelector } from "react-redux";
import { selectAuthState } from "store/Auth";

export default function ProfilePage() {
  const router = useRouter();
  const authState = useSelector(selectAuthState);
  const { hexOrNpub } = router.query;
  const { pk, npub } = useMemo(
    () => getPublicKeys(hexOrNpub as string),
    [hexOrNpub]
  );
  const user = useUser(pk);
  const nip05Status = useNip05(user?.hexpubkey(), user?.profile?.nip05);
  const [bannerHasError, setBannerHasError] = useState(false);
  const normalizeNip05 = (nip05?: string) => {
    if (!nip05) {
      return "";
    }

    const isRootId = nip05[0] === "_";

    return isRootId ? nip05.split("@")[1] : nip05;
  };
  const divRef = useRef<HTMLDivElement>(null);
  const footerHeight = useFooterHeight();

  return (
    <>
      <Head>
        <title>{`Stemstr - ${user?.profile?.displayName || "Profile"}`}</title>
      </Head>
      <Box ref={divRef}>
        <Box
          sx={(theme) => ({
            position: "relative",
            padding: `${theme.spacing.md}px ${theme.spacing.md}px 0`,
            height: 200,
          })}
        >
          {user?.profile && (
            <Image
              src={
                !user.profile.banner || bannerHasError
                  ? "/default-banner.png"
                  : user.profile.banner
              }
              onError={() => setBannerHasError(true)}
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
            <Group>
              {pk === authState.pk &&
                authState.subscriptionStatus?.created_at !== undefined && (
                  <SubscriptionStatusDrawer />
                )}
              <ActionIcon
                component={Link}
                href={Route.Settings}
                variant="transparent"
              >
                <SettingsIcon color="white" width={24} height={24} />
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
                  {normalizeNip05(user?.profile?.nip05)}
                </Text>
              </>
            )}
          </Group>
          <Text
            size="sm"
            mb={8}
            sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
          >
            {user?.profile?.about}
          </Text>
          <CopyNpub npub={npub} />
        </Stack>
        <ProfileContactsBar pubkey={pk} />
      </Box>
      <Box h={`calc(100vh - ${footerHeight}px)`}>
        <ProfileFeed pubkey={pk} aboveContentRef={divRef} />
      </Box>
    </>
  );
}

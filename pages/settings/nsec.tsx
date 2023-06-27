import { Box, Button, CopyButton, Group, Text } from "@mantine/core";
import BackButton from "components/BackButton/BackButton";
import { Route } from "enums";
import useAuth from "hooks/useAuth";
import { ChevronLeftIcon, LockIcon } from "icons/StemstrIcon";
import Head from "next/head";
import { useRouter } from "next/router";
import { nip19 } from "nostr-tools";
import { useMemo } from "react";

export default function SettingsNsec() {
  const router = useRouter();
  const { authState, guardAuth, isAuthenticated } = useAuth();
  guardAuth();
  const nsec = useMemo(
    () => (authState.sk ? nip19.nsecEncode(authState.sk) : undefined),
    [authState.sk]
  );

  if (!nsec) {
    router.push(Route.Settings);
    return;
  }

  return isAuthenticated ? (
    <>
      <Head>
        <title>Stemstr - Settings</title>
      </Head>
      <Group p="md" spacing="sm" align="center" c="white">
        <BackButton defaultUrl={Route.Settings}>
          <ChevronLeftIcon width={24} height={24} />
        </BackButton>
        <Text c="white" fw="bold" fz={24} lh="normal">
          Secret account ID
        </Text>
      </Group>
      <Box pl="md" pr="md" pt={32}>
        <Text fz="sm" fw={500} c="white" mb={10}>
          This is your nsec
        </Text>
        <Text c="gray.1" fw={500} mb={24} sx={{ overflowWrap: "anywhere" }}>
          {nsec}
        </Text>
        <CopyButton value={nsec}>
          {({ copied, copy }) => (
            <Button mb={16} onClick={copy} fullWidth>
              {copied ? "Copied" : "Copy to clipboard"}
            </Button>
          )}
        </CopyButton>
        <Box
          p="md"
          bg="purple.8"
          sx={(theme) => ({
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: theme.colors.purple[5],
            borderRadius: 12,
          })}
        >
          <Group mb={12}>
            <LockIcon width={16} height={16} color="white" />
            <Text fw={500} c="white">
              Do not share!!
            </Text>
          </Group>
          <Text fz="xs" c="purple.2">
            Do not share this secret account login ID, please understand that
            this is your PASSWORD, if you loss this private key or expose it
            online, your account can be stolen, please be cautious. There is no
            way to recover your private key.
          </Text>
        </Box>
      </Box>
    </>
  ) : null;
}

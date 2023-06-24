import { Button, Center, CopyButton, Group, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { getPublicKey, nip19 } from "nostr-tools";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  CheckCircleIcon,
  ChevronRightIcon,
  CopyIcon,
  KeyIcon,
} from "../../icons/StemstrIcon";
import { abbreviateKey } from "../../ndk/utils";
import { setIsNewlyCreatedUser, setSK } from "../../store/Auth";
import { Route } from "../../enums/routes";

export default function SignupComplete({ sk }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const nsec = useMemo(() => nip19.nsecEncode(sk), [sk]);
  const pk = useMemo(() => getPublicKey(sk), [sk]);
  const npub = useMemo(() => nip19.npubEncode(pk), [pk]);
  const abbreviatedNpub = useMemo(() => abbreviateKey(npub), [npub]);
  const abbreviatedNsec = useMemo(() => abbreviateKey(nsec), [nsec]);

  useEffect(() => {
    dispatch(setSK(sk));
    dispatch(setIsNewlyCreatedUser(true));
  }, [sk]);

  return (
    <>
      <Center
        sx={(theme) => ({
          width: 64,
          height: 64,
          borderRadius: "50%",
          background:
            "linear-gradient(142.52deg, #2ECDCD 9.14%, rgba(36, 238, 178, 0.76) 90.68%)",
          color: theme.white,
          margin: "32px auto 24px",
        })}
      >
        <KeyIcon width={32} height={32} />
      </Center>
      <Text ta="center" fz="xl" fw="bold" c="white" mb={32}>
        Here are your keys!
      </Text>
      <Stack
        sx={(theme) => ({
          border: `1px solid ${theme.colors.gray[4]}`,
          borderRadius: theme.radius.lg,
          padding: theme.spacing.md,
          marginBottom: 32,
          textAlign: "center",
          color: theme.white,
          background:
            "linear-gradient(102.06deg, #2B2B2D 41.2%, rgba(39, 62, 75, 0.2) 91.4%, #2B2B2D 100%)",
        })}
        spacing={8}
      >
        <Text fw={500}>Your public key</Text>
        <Text fz="sm" c="gray.1">
          This is good for sharing with everyone 🎉
        </Text>
        <CopyButton value={npub}>
          {({ copied, copy }) => (
            <Group
              onClick={copy}
              position="apart"
              sx={(theme) => ({
                border: `1px solid ${theme.colors.gray[4]}`,
                borderRadius: theme.radius.md,
                padding: "12px 8px",
                cursor: "pointer",
              })}
            >
              <Text fz="xs">Public key</Text>
              <Text fz="xs">
                <Text fw={900} span>
                  npub
                </Text>
                {abbreviatedNpub.slice(4)}
              </Text>
              {copied ? (
                <CheckCircleIcon width={16} height={16} />
              ) : (
                <CopyIcon width={16} height={16} />
              )}
            </Group>
          )}
        </CopyButton>
      </Stack>
      <Stack
        sx={(theme) => ({
          border: `1px solid ${theme.colors.gray[4]}`,
          borderRadius: theme.radius.lg,
          padding: theme.spacing.md,
          marginBottom: 32,
          textAlign: "center",
          color: theme.white,
          background:
            "linear-gradient(102.06deg, #2B2B2D 41.2%, rgba(39, 62, 75, 0.2) 91.4%, #2B2B2D 100%)",
        })}
        spacing={8}
      >
        <Text fw={500}>Your private key</Text>
        <Text fz="sm" c="gray.1">
          This is like your password to all nostr apps 🔐
        </Text>
        <CopyButton value={nsec}>
          {({ copied, copy }) => (
            <Group
              onClick={copy}
              position="apart"
              sx={(theme) => ({
                border: `1px solid ${theme.colors.gray[4]}`,
                borderRadius: theme.radius.md,
                padding: "12px 8px",
                cursor: "pointer",
              })}
            >
              <Text fz="xs">Private key</Text>
              <Text fz="xs">
                <Text fw={900} span>
                  nsec
                </Text>
                {abbreviatedNsec.slice(4)}
              </Text>
              {copied ? (
                <CheckCircleIcon width={16} height={16} />
              ) : (
                <CopyIcon width={16} height={16} />
              )}
            </Group>
          )}
        </CopyButton>
      </Stack>
      <Button onClick={() => router.push(Route.Home)} fullWidth>
        Private key secured 🫡 Let’s go!{" "}
        <ChevronRightIcon width={16} height={16} />
      </Button>
    </>
  );
}

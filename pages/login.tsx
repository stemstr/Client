import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Flex,
  Box,
  Button,
  Group,
  Image,
  Space,
  Stack,
  Text,
} from "@mantine/core";

import { Route } from "enums";

import { setNIP07 } from "store/Auth";
import LoginForm from "components/LoginForm/LoginForm";
import NDK, { NDKNip07Signer } from "@nostr-dev-kit/ndk";
import { useNDK } from "ndk/NDKProvider";

const LEARN_MORE_URL = "https://www.stemstr.app/";

export default function Login() {
  const { ndk } = useNDK();
  const router = useRouter();
  const dispatch = useDispatch();

  const [showExtensionLogin, setShowExtensionLogin] = useState(false);

  const handleSecureLogin = async () => {
    try {
      const signer = new NDKNip07Signer();
      signer?.user().then((user) => {
        dispatch(setNIP07(user.npub));
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setShowExtensionLogin(!!window.nostr);
  });

  return (
    <>
      <Head>
        <title>Stemstr - Login</title>
      </Head>
      <Stack spacing={0} align="center" sx={{ marginTop: 48 }}>
        <Flex
          sx={(theme) => ({
            alignItems: "center",
            flexDirection: "row",
            marginBottom: 30,
            [theme.fn.largerThan("xs")]: {
              flexDirection: "column",
              marginBottom: 48,
            },
          })}
        >
          <Image
            src="/logo.svg"
            alt="stemstr"
            width={66}
            height={66}
            sx={(theme) => ({
              marginRight: 10,
              [theme.fn.largerThan("xs")]: {
                marginRight: 0,
                marginBottom: 16,
              },
            })}
          />
          <Flex
            sx={(theme) => ({
              flexDirection: "column",
              alignItems: "left",
              [theme.fn.largerThan("xs")]: {
                alignItems: "center",
              },
            })}
          >
            <Text fz={32} fw={700} c="gray.0" lh="normal">
              Stemstr
            </Text>

            <Text
              variant="gradient"
              gradient={{ from: "#F9F5FF", to: "#A17BF0", deg: 135 }}
              fz="xl"
              lh="normal"
            >
              Where music gets made
            </Text>
          </Flex>
        </Flex>

        <Stack
          sx={{
            width: "100%",
            maxWidth: 342,
          }}
        >
          <Box
            sx={(theme) => ({
              border: `1px solid ${theme.colors.gray[4]}`,
              borderRadius: theme.radius.lg,
              padding: theme.spacing.md,
            })}
          >
            <Text ta="center" mb="sm" c="white" fw={500}>
              You new here?
            </Text>
            <Text ta="center" mb="md" c="gray.0" fz="sm">
              Ready to get started?
            </Text>
            <Group grow>
              <Button
                onClick={() => router.push(Route.Discover)}
                variant="light"
              >
                Explore
              </Button>
              <Button onClick={() => router.push(Route.Signup)} fullWidth>
                Create account
              </Button>
            </Group>
          </Box>
          <Box
            sx={(theme) => ({
              border: `1px solid ${theme.colors.gray[4]}`,
              borderRadius: theme.radius.lg,
              padding: theme.spacing.md,
            })}
          >
            <LoginForm />
            {showExtensionLogin && (
              <>
                <Space h={24} />
                <Text fz="xs" c="white" fw={500} mb={8}>
                  Login with Extension ⓘ
                </Text>
                <Button onClick={handleSecureLogin} variant="light" fullWidth>
                  Connect
                </Button>
              </>
            )}
          </Box>
        </Stack>
      </Stack>
    </>
  );
}

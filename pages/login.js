import {
  MediaQuery,
  Box,
  Button,
  Flex,
  Group,
  Image,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import LoginForm from "../components/LoginForm/LoginForm";
import { setNIP07 } from "../store/Auth";
import { Route } from "../enums/routes";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showExtensionLogin, setShowExtensionLogin] = useState(false);

  const handleSecureLogin = () => {
    if (window.nostr) {
      window.nostr
        .getPublicKey()
        .then((pk) => {
          dispatch(setNIP07(pk));
        })
        .catch((err) => {
          console.error(err);
        });
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
        <Box
          sx={{
            "@media (max-width: 480px)": {
              display: "flex",
              justifyContent: "center",
              maxWidth: 348,
              marginBottom: "20px",
            },
          }}
        >
          <Image
            src="/logo.svg"
            alt="stemstr"
            width={66}
            height={66}
            sx={{
              margin: "auto",
              marginBottom: 16,
              "@media (max-width: 480px)": {
                marginRight: "10px",
              },
            }}
          />
          <Box>
            <MediaQuery
              query="(max-width: 480px)"
              styles={{ textAlign: "left" }}
            >
              <Text fz={32} fw={700} c="gray.0" ta="center" lh="normal">
                Stemstr
              </Text>
            </MediaQuery>

            <Box sx={{ textAlign: "center" }}>
              <Text
                variant="gradient"
                gradient={{ from: "#F9F5FF", to: "#A17BF0", deg: 135 }}
                display="inline-block"
                fz="xl"
                ta="center"
                mb={48}
                lh="normal"
                sx={{
                  "@media (max-width: 480px)": {
                    marginBottom: "10px",
                  },
                }}
              >
                Where music gets made
              </Text>
            </Box>
          </Box>
        </Box>

        <Stack
          sx={{
            maxWidth: 348,
            margin: "auto",
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
              <Button variant="light">Learn more</Button>
              <Button onClick={() => router.push(Route.Signup)} fullWidth>
                Sign me up
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

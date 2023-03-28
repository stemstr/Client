import { Box, Button, Group, Image, Space, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import LoginForm from "../components/LoginForm/LoginForm";
import { setNIP07 } from "../store/Auth";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();

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

  return (
    <Box
      sx={{
        marginTop: 48,
      }}
    >
      <Image
        src="/logo.svg"
        alt="stemstr"
        width={66}
        height={66}
        sx={{ margin: "auto", marginBottom: 16 }}
      />
      <Text fz={32} fw={700} c="gray.0" ta="center" lh="normal">
        Stemstr
      </Text>
      <Box sx={{ textAlign: "center" }}>
        <Text
          variant="gradient"
          gradient={{ from: "#F9F5FF", to: "#A17BF0", deg: 135 }}
          display="inline-block"
          fz="xl"
          ta="center"
          mb={48}
          lh="normal"
        >
          The sounds of music
        </Text>
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
            <Button onClick={() => router.push(`/signup`)} fullWidth>
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
          <Space h={24} />
          <Text fz="xs" c="white" fw={500} mb={8}>
            Login with Extension ⓘ
          </Text>
          <Button onClick={handleSecureLogin} variant="light" fullWidth>
            Connect
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

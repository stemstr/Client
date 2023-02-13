import { Box, Button, Image, Space, Text, TextInput } from "@mantine/core";
import LoginForm from "../components/LoginForm/LoginForm";

export default function Login() {
  return (
    <Box
      sx={{
        marginTop: 136,
      }}
    >
      <Image
        src="/logo.svg"
        alt="stemstr"
        width={70}
        height={70}
        sx={{ margin: "auto", marginBottom: 34 }}
      />
      <Text fz={32} fw={700} c="gray.0" ta="center" mb="md">
        Login
      </Text>
      <Text fz="sm" c="gray.1" ta="center" mb={44}>
        Enter your private key in the input below to sign in
      </Text>
      <Box sx={{ marginLeft: 64, marginRight: 64 }}>
        <LoginForm />
        <Space h={40} />
        <Box
          sx={(theme) => ({
            borderRadius: theme.radius.lg,
            border: `1px solid ${theme.colors.gray[4]}`,
            padding: 24,
            background: `linear-gradient(102.06deg, #2B2B2D 41.2%, rgba(39, 62, 75, .3) 76.4%, #2B2B2D 100%)`,
          })}
        >
          <Text fz="xl" mb={8}>
            <Text c="white" span>
              Need an account?
            </Text>
            <Text span></Text> — we got you!
          </Text>
          <Text fz="sm" mb={16}>
            Quickly generate your keys. Make sure you save them safely.
          </Text>
          <Button
            sx={(theme) => ({
              background: theme.colors.gray[7],
            })}
          >
            Generate key
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

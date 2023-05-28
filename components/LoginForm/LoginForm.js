import { Button, PasswordInput, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState, setSK } from "../../store/Auth";

export default function LoginForm() {
  const authState = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const router = useRouter();
  const form = useForm({
    initialValues: {
      sk: "",
    },
    validate: {
      sk: (value) => (value ? null : "Invalid privkey"),
    },
  });

  const handleSubmit = (values) => {
    dispatch(setSK(values.sk));
  };

  useEffect(() => {
    if (authState.pk) {
      router.push(`/user/${authState.pk}`);
    }
  }, [authState.pk]);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <PasswordInput
        {...form.getInputProps("sk")}
        placeholder="Login with private key"
        aria-label="Private key"
        label={
          <Text fz="xs" c="white" mb={8}>
            Already on nostr?
          </Text>
        }
        styles={(theme) => ({
          root: {
            marginBottom: 24,
          },
        })}
      />
      <Button type="submit" color="green" fullWidth>
        Login with key
      </Button>
    </form>
  );
}

import { TextInput } from "@mantine/core";

export default function LNURLField(props) {
  return (
    <TextInput
      placeholder="This will look like funny numbers and letters"
      styles={(theme) => ({
        input: {
          backgroundColor: theme.colors.dark[7],
          padding: theme.spacing.md,
          borderRadius: theme.radius.md,
          border: `1px solid ${theme.colors.gray[4]}`,
          fontSize: theme.fontSizes.sm,
          color: theme.white,
        },
      })}
      {...props}
    />
  );
}

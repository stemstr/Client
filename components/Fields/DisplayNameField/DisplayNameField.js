import { TextInput } from "@mantine/core";

export default function DisplayNameField(props) {
  return (
    <TextInput
      placeholder="What do you want to be called?"
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

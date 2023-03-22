import { TextInput } from "@mantine/core";

export default function NameField({ onChange, ...rest }) {
  const handleChange = (event) => {
    let val = event.target.value;
    if (val && !val.startsWith("@")) val = `@${val}`;
    onChange(val);
  };

  return (
    <TextInput
      placeholder="@entercrazywildnamehere"
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
      {...rest}
      onChange={handleChange}
    />
  );
}

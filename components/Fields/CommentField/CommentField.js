import { Textarea } from "@mantine/core";

export default function CommentField(props) {
  return (
    <Textarea
      placeholder="Tell ‘em bout it"
      styles={(theme) => ({
        input: {
          backgroundColor: theme.colors.dark[7],
          padding: theme.spacing.md,
          borderRadius: theme.radius.md,
          border: `1px solid ${theme.colors.gray[4]}`,
          fontSize: theme.fontSizes.md,
          lineHeight: "150%",
        },
      })}
      {...props}
    ></Textarea>
  );
}

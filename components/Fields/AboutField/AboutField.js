import { Textarea } from "@mantine/core";

export default function AboutField(props) {
  return (
    <Textarea
      autosize
      placeholder="Tell the world a lil' something"
      styles={(theme) => ({
        input: {
          backgroundColor: theme.colors.dark[7],
          padding: theme.spacing.md,
          borderRadius: theme.radius.md,
          border: `1px solid ${theme.colors.gray[4]}`,
          fontSize: theme.fontSizes.sm,
          lineHeight: "150%",
        },
      })}
      {...props}
    ></Textarea>
  );
}

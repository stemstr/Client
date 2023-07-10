import { Group, Text, TextInput, TextInputProps } from "@mantine/core";

export default function TagsField(props: TextInputProps) {
  return (
    <>
      <TextInput
        placeholder="#soul, #drums, #percussion"
        styles={(theme) => ({
          input: {
            backgroundColor: theme.colors.dark[7],
            padding: "12px 16px",
            height: "auto",
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.gray[4]}`,
            fontSize: theme.fontSizes.md,
            lineHeight: "150%",
          },
        })}
        {...props}
      ></TextInput>
      <Text c="dark.2" fz="xs">
        What style or genre is this?
      </Text>
    </>
  );
}

export const parseHashtags = (hashtagsString: string): string[] => {
  // Regular expression to match hashtags with alphanumeric characters only
  const hashtagRegex = /#[A-Za-z0-9]+/g;
  // Use match() method to find all occurrences of the hashtagRegex in the string
  const hashtags = hashtagsString.match(hashtagRegex);
  // Remove "#" symbol from each hashtag and return array
  return hashtags ? hashtags.map((hashtag) => hashtag.slice(1)) : [];
};

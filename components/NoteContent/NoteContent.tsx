import { Fragment } from "react";
import { Text } from "@mantine/core";
import MentionLink from "./MentionLink";
import { NPUB_NOSTR_URI_REGEX } from "../../constants";

export const NoteContent = ({ content }: { content: string }) => {
  const parts = content.split(NPUB_NOSTR_URI_REGEX);
  const formattedContent = parts.map((part, index) => {
    if (part === undefined) {
      return null;
    }

    if (NPUB_NOSTR_URI_REGEX.test(part)) {
      return <MentionLink key={index} nostrUri={part} />;
    }

    return <Fragment key={index}>{part}</Fragment>;
  });

  return (
    <Text c="white" sx={{ overflowWrap: "anywhere" }}>
      {NPUB_NOSTR_URI_REGEX.test(content) ? formattedContent : content}
    </Text>
  );
};

export default NoteContent;

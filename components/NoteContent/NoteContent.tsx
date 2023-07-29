import { Fragment } from "react";
import { Text } from "@mantine/core";
import MentionLink from "./MentionLink";
import { NPUB_NOSTR_URI_REGEX } from "../../constants";
import HyperLink from "./HyperLinks";

const HYPERLINK_REGEX =
  /(https?:\/\/[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|])/;

export const NoteContent = ({ content }: { content: string }) => {
  const formattingRegEx = new RegExp(
    `(?:${NPUB_NOSTR_URI_REGEX.source}|${HYPERLINK_REGEX.source})`,
    "gi"
  );
  const parts = content.split(formattingRegEx);
  const formattedContent = parts.map((part, index) => {
    if (part === undefined) {
      return null;
    }

    if (NPUB_NOSTR_URI_REGEX.test(part)) {
      return <MentionLink key={index} nostrUri={part} />;
    }

    if (HYPERLINK_REGEX.test(part)) {
      return <HyperLink key={index} href={part} />;
    }

    return <Fragment key={index}>{part}</Fragment>;
  });

  return (
    <Text c="white" sx={{ overflowWrap: "anywhere" }}>
      {formattingRegEx.test(content) ? formattedContent : content}
    </Text>
  );
};

export default NoteContent;

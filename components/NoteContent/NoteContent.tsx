import { Fragment, type MouseEvent } from "react";
import { Text, Anchor, DefaultProps } from "@mantine/core";
import MentionLink from "./MentionLink";
import { NPUB_NOSTR_URI_REGEX } from "../../constants";
import useStyles from "./NoteContent.styles";

const HYPERLINK_REGEX =
  /(https?:\/\/[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|])/;

type NoteContentProps = DefaultProps & { content: string };

export const NoteContent = ({ content, ...rest }: NoteContentProps) => {
  const { classes } = useStyles();
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
      return (
        <Anchor
          key={index}
          className={classes.anchor}
          href={part}
          onClick={(e: MouseEvent) => e.stopPropagation()}
          target="_blank"
          rel="noreferrer"
        >
          {part}
        </Anchor>
      );
    }

    return <Fragment key={index}>{part}</Fragment>;
  });

  return (
    <Text c="white" sx={{ overflowWrap: "anywhere" }} {...rest}>
      {formattingRegEx.test(content) ? formattedContent : content}
    </Text>
  );
};

export default NoteContent;

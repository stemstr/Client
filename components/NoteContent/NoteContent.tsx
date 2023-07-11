import { Fragment, useMemo, useState } from "react";
import { Text } from "@mantine/core";
import MentionLink from "./MentionLink";
import { NEVENT_NOSTR_URI_REGEX, NPUB_NOSTR_URI_REGEX } from "../../constants";
import { useEvent } from "ndk/NDKEventProvider";
import SoundPlayer from "components/SoundPlayer/SoundPlayer";

export const NoteContent = ({ content }: { content: string }) => {
  const { event } = useEvent();
  const parts = parseContent(content);
  const formattedContent = useMemo(() => {
    return parts.map((part, index) => {
      if (part === undefined) {
        return null;
      }

      if (
        NEVENT_NOSTR_URI_REGEX.test(part) &&
        index === 0 &&
        event.tags.some((tag) => tag[0] === "stream_url")
      ) {
        // SoundPlayer is rendered in Note.tsx so we skip it here
        return null;
      }

      if (NPUB_NOSTR_URI_REGEX.test(part)) {
        // Convert npub uris to links
        return <MentionLink key={index} nostrUri={part} />;
      }

      return <Fragment key={index}>{part}</Fragment>;
    });
  }, [content]);

  return (
    <Text c="white" sx={{ overflowWrap: "anywhere" }}>
      {formattedContent}
    </Text>
  );
};

const parseContent = (content: string): string[] => {
  const regexps = [NEVENT_NOSTR_URI_REGEX, NPUB_NOSTR_URI_REGEX];
  let parts = [content];
  regexps.forEach((regexp) => {
    parts = parts.reduce<string[]>((acc, part) => {
      const splitParts = part
        .split(regexp) // split by regex
        .filter(Boolean); // remove empty parts
      acc.push(...splitParts);
      return acc;
    }, []);
  });
  return parts;
};

export default NoteContent;

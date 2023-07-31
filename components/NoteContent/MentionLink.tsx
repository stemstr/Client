import { useEffect, useState } from "react";
import Link from "next/link";
import { Anchor } from "@mantine/core";
import { useUser } from "../../ndk/hooks/useUser";
import { type NDKUser } from "@nostr-dev-kit/ndk";
import { convertNpubToHex } from "../../ndk/utils";
import useStyles from "./NoteContent.styles";

export const MentionLink = ({ nostrUri }: { nostrUri: string }) => {
  const { classes } = useStyles();
  let pubkey;

  try {
    pubkey = convertNpubToHex(nostrUri.replace(/^nostr:/, ""));
  } catch {
    // fail silently
  }

  const user = useUser(pubkey);
  const formatDisplayName = (user?: NDKUser) => {
    if (!user?.profile?.name && !user?.profile?.displayName) {
      return;
    }

    return `@${user.profile.name || user.profile.displayName}`;
  };
  const [anchorText, setAnchorText] = useState(
    formatDisplayName(user) ?? nostrUri
  );
  const isAnchorTextFormattedAsMention = anchorText[0] === "@";

  useEffect(() => {
    if (isAnchorTextFormattedAsMention) {
      return;
    }

    const mention = formatDisplayName(user);

    if (mention) {
      setAnchorText(mention);
    }
  }, [user, isAnchorTextFormattedAsMention]);

  return pubkey ? (
    <Anchor
      className={classes.anchor}
      component={Link}
      href={`/user/${pubkey}`}
      onClick={(e) => e.stopPropagation()}
    >
      {anchorText}
    </Anchor>
  ) : (
    <>{nostrUri}</>
  );
};

export default MentionLink;

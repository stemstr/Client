import { useEffect, useState } from "react";
import Link from "next/link";
import { Anchor } from "@mantine/core";
import { useUser } from "../../ndk/hooks/useUser";
import { type NDKUser } from "@nostr-dev-kit/ndk";
import { convertNpubToHex } from "../../ndk/utils";

export const MentionLink = ({ nostrUri }: { nostrUri: string }) => {
  let pubkey;

  try {
    pubkey = convertNpubToHex(nostrUri.replace(/^nostr:/, ""));
  } catch {
    // fail silently
  }

  const user = useUser(pubkey);
  const formatDisplayName = (user?: NDKUser) => {
    if (!user?.profile || !user?.profile.name || !user?.profile.displayName) {
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
      component={Link}
      href={`/user/${pubkey}`}
      onClick={(e) => e.stopPropagation()}
      c="purple.4"
    >
      {anchorText}
    </Anchor>
  ) : (
    <>{nostrUri}</>
  );
};

export default MentionLink;

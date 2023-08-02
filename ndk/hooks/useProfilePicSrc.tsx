import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { thumbs } from "@dicebear/collection";
import { NDKUser } from "@nostr-dev-kit/ndk";

export default function useProfilePicSrc(user?: NDKUser) {
  const src = useMemo(() => {
    if (user?.profile?.image) return user.profile.image;

    const avatar = createAvatar(thumbs, {
      seed: user?.hexpubkey(),
      scale: 75,
      shapeColor: [
        "EAE2FC", // purple.0
        "BFAAEA", // purple.2
        "865AE2", // purple.5
        "763AF4", // purple.7
        "41355C", // purple.8
      ],
      backgroundColor: [
        "8BF6E3", // green.0
        "09D4B0", // green.2
        "07B898", // green.5
        "0B6252", // green.8
      ],
      backgroundType: ["gradientLinear"],
    });
    const svg = avatar.toString();

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }, [user?.profile?.image]);

  return src;
}

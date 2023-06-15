import { useNDK } from "ndk/NDKProvider";
import { useEffect, useState } from "react";

export default function usePreloadProfileCache(pubkeys: string[]) {
  const { ndk } = useNDK();
  const [hasAttemptedPreload, setHasAttemptedPreload] = useState(false);
  const dedupedPubkeys = Array.from(new Set(pubkeys));
  const dedupedPubkeysHash = pubkeys.join();

  useEffect(() => {
    if (!ndk || dedupedPubkeysHash.length === 0) {
      return;
    }

    ndk
      .fetchEvents({ kinds: [0], authors: dedupedPubkeys })
      .catch(console.error)
      .finally(() => setHasAttemptedPreload(true));
  }, [ndk, dedupedPubkeysHash]);

  return hasAttemptedPreload;
}

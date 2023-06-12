import { useNDK } from "ndk/NDKProvider";
import { useEffect, useState } from "react";

export default function usePreloadProfileCache(pubkeys: string[]) {
  const { ndk } = useNDK();
  const [hasAttemptedPreload, setHasAttemptedPreload] = useState(false);
  const pubkeysHash = pubkeys.join();

  useEffect(() => {
    if (!ndk || pubkeysHash.length === 0) {
      return;
    }

    ndk
      .fetchEvents({ kinds: [0], authors: pubkeys })
      .catch(console.error)
      .finally(() => setHasAttemptedPreload(true));
  }, [ndk, pubkeysHash]);

  return hasAttemptedPreload;
}

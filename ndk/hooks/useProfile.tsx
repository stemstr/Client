import { useEffect, useState } from "react";
import { NDKUserProfile } from "@nostr-dev-kit/ndk";
import { useNDK } from "ndk/NDKProvider";
import { getCachedProfile } from "../inMemoryCacheAdapter";

export function useProfile({ pubkey }: { pubkey: string }) {
  const { ndk } = useNDK();
  const [profile, setProfile] = useState<NDKUserProfile | undefined>(
    getCachedProfile(pubkey, ndk)
  );

  useEffect(() => {
    if (!pubkey || profile) {
      return;
    }

    if (ndk) {
      const fetchUser = async () => {
        const newUser = ndk.getUser({ hexpubkey: pubkey });
        await newUser.fetchProfile();

        if (Object.values(newUser.profile ?? {}).length > 0) {
          setProfile(newUser.profile);
        }
      };
      fetchUser();
    }
  }, [pubkey, profile, setProfile]);

  return { data: profile };
}

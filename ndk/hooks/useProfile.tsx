import { useEffect, useState } from "react";
import { NDKUser } from "@nostr-dev-kit/ndk";
import { useNDK } from "ndk/NDKProvider";

export function useProfile({ pubkey }: { pubkey: string }) {
  const { ndk } = useNDK();
  const [user, setUser] = useState<NDKUser | null>(null);

  useEffect(() => {
    if (!pubkey) {
      return;
    }
    if (ndk) {
      const fetchUser = async () => {
        const newUser = ndk.getUser({ hexpubkey: pubkey });
        await newUser.fetchProfile();
        setUser(newUser);
      };
      fetchUser();
    }
  }, [pubkey, setUser]);

  return { data: user?.profile };
}

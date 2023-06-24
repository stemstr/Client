import { useEffect, useState } from "react";
import { getCachedUser } from "../inMemoryCacheAdapter";
import { useNDK } from "../NDKProvider";

export function useUser(pubkey?: string) {
  const { ndk } = useNDK();
  const [user, setUser] = useState(getCachedUser(pubkey, ndk));

  useEffect(() => {
    if (!ndk || !pubkey) {
      return;
    }

    const fetchUser = async () => {
      const newUser =
        getCachedUser(pubkey, ndk) ?? ndk.getUser({ hexpubkey: pubkey });

      if (!newUser.profile) {
        await newUser.fetchProfile();
      }

      setUser(newUser);
    };
    fetchUser();
  }, [pubkey, ndk]);

  return user;
}

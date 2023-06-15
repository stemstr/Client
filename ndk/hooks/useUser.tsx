import { useEffect, useState } from "react";
import { getCachedUser } from "../inMemoryCacheAdapter";
import { useNDK } from "../NDKProvider";

export function useUser(pubkey?: string) {
  const { ndk } = useNDK();
  const [user, setUser] = useState(getCachedUser(pubkey, ndk));

  useEffect(() => {
    if (!ndk || !pubkey || user) {
      return;
    }

    const fetchUser = async () => {
      const newUser = ndk.getUser({ hexpubkey: pubkey });
      await newUser.fetchProfile();
      setUser(newUser);
    };
    fetchUser();
  }, [pubkey, ndk, user]);

  return user;
}

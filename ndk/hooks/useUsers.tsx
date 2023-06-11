import { useEffect, useRef, useState } from "react";
import { NDKUser, NDKUserProfile } from "@nostr-dev-kit/ndk";
import { useNDK } from "ndk/NDKProvider";
import { getCachedProfile } from "../inMemoryCacheAdapter";

export function useUsers(pubkeys: string[]): NDKUser[] {
  const { ndk } = useNDK();
  const [users, setUsers] = useState<Map<string, NDKUser>>(new Map()); // Map pubkeys to users
  const queriedPubkeys = useRef<string[]>([]);

  useEffect(() => {
    if (ndk) {
      const pubkeysToQuery = pubkeys.filter(
        (pubkey) => !queriedPubkeys.current.includes(pubkey)
      );
      pubkeysToQuery.forEach((pubkey) => {
        queriedPubkeys.current.push(pubkey);
        const user = ndk.getUser({ hexpubkey: pubkey });
        const cachedProfile = getCachedProfile(pubkey, ndk);
        user.profile = cachedProfile;
        user.fetchProfile().then(() => setUsers((prev) => new Map(prev)));
        setUsers((prev) => new Map([...prev, [pubkey, user]]));
      });
    }
  }, [pubkeys.length]);

  return Array.from(users.values());
}

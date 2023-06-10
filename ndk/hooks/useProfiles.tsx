import { useEffect, useRef, useState } from "react";
import NDK, { NDKUser } from "@nostr-dev-kit/ndk";
import { useNDK } from "ndk/NDKProvider";

export function useProfiles({ hexpubkeys }: { hexpubkeys: string[] }) {
  const { ndk } = useNDK();
  const [users, setUsers] = useState<Map<string, NDKUser>>(new Map());
  const queriedPubkeys = useRef<string[]>([]);

  useEffect(() => {
    if (ndk) {
      hexpubkeys.forEach((pubkey) => {
        const alreadyQueried = !!queriedPubkeys.current.find(
          (k) => k === pubkey
        );
        queriedPubkeys.current.push(pubkey);
        if (alreadyQueried) {
          return;
        } else {
          if (pubkey.startsWith("333")) console.log(pubkey);
          const newUser = ndk.getUser({ hexpubkey: pubkey });
          setUsers((prevUsers) => new Map([...prevUsers, [pubkey, newUser]]));
          newUser.fetchProfile().then((events) => {
            setUsers((prevUsers) => new Map([...prevUsers]));
          });
        }
      });
    }
  }, [hexpubkeys.length, setUsers]);

  return Array.from(users.values());
}

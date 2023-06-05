import { useEffect, useState } from "react";
import NDK, { NDKUser } from "@nostr-dev-kit/ndk";
import { useNDK } from "ndk/NDKProvider";

export function useProfiles({ hexpubkeys }: { hexpubkeys: string[] }) {
  const { ndk } = useNDK();
  const [users, setUsers] = useState<Map<string, NDKUser>>(new Map());

  useEffect(() => {
    if (ndk) {
      hexpubkeys.forEach((pubkey) => {
        let user = users.get(pubkey);
        if (user) {
          return;
        } else {
          const newUser = ndk.getUser({ hexpubkey: pubkey });
          setUsers(
            (prevUsers) =>
              new Map([...prevUsers, [newUser.hexpubkey(), newUser]])
          );
          newUser.fetchProfile().then((event) => {
            setUsers((prevUsers) => new Map([...prevUsers]));
          });
        }
      });
    }
  }, [hexpubkeys.length]);

  return Array.from(users.values());
}

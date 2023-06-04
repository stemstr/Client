import { NDKUser } from "@nostr-dev-kit/ndk";
import { useNDK } from "ndk/NDKProvider";
import { useEffect, useState } from "react";

export default function useContactList({ hexpubkey }: { hexpubkey?: string }) {
  const { ndk } = useNDK();
  const [user, setUser] = useState<NDKUser | undefined>();
  const [contactList, setContactList] = useState<Set<NDKUser>>(new Set());

  useEffect(() => {
    if (hexpubkey && ndk) {
      const newUser = ndk.getUser({ hexpubkey: hexpubkey });
      setUser(newUser);
    }
  }, [hexpubkey, ndk]);

  useEffect(() => {
    if (user) {
      user.follows().then((follows) => {
        setContactList(follows);
      });
    }
  }, [user]);

  return contactList;
}

import { useEffect, useState } from "react";
import { NDKUser } from "@nostr-dev-kit/ndk";
import { useUsers } from "./useUsers";

export function useUser(pubkey?: string): NDKUser | undefined {
  const users = useUsers(pubkey ? [pubkey] : []);
  const [user, setUser] = useState<NDKUser | undefined>();

  useEffect(() => {
    if (users.length) {
      setUser(users[0]);
    }
  }, [users[0], users.length, setUser]);

  return user;
}

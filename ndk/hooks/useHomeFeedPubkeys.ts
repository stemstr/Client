import { useNDK } from "ndk/NDKProvider";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "store/Store";

export default function useHomeFeedPubkeys() {
  const { ndk } = useNDK();
  const [pubkeys, setPubkeys] = useState<string[]>([]);
  const authState = useSelector((state: AppState) => state.auth);
  const pubkey = authState.pk;

  useEffect(() => {
    if (!pubkey || !ndk) {
      return;
    }

    const currentUser = ndk.getUser({ hexpubkey: pubkey });

    currentUser.follows().then((follows) => {
      setPubkeys(
        Array.from(follows.add(currentUser)).map((user) => user.hexpubkey())
      );
    });
  }, [pubkey, ndk]);

  return pubkeys;
}

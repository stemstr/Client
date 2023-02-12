import { useProfile } from "nostr-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "./Auth";

export default function NostrStateProvider({ pk }) {
  const dispatch = useDispatch();
  const { data: userData } = useProfile({
    pubkey: pk,
  });

  useEffect(() => {
    if (userData?.npub) {
      dispatch(setAuthUser(userData));
    }
  }, [userData?.npub]);

  return <></>;
}

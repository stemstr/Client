import { useProfile } from "../nostr/hooks/useProfile";
import { nip19 } from "nostr-tools";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { cacheProfile, getCachedProfile } from "../cache/cache";
import { setAuthUser } from "./Auth";

export default function NostrAuthStateProvider({ pk }) {
  const dispatch = useDispatch();

  const npub = pk ? nip19.npubEncode(pk) : null;
  const cachedProfile = getCachedProfile(npub);
  cacheProfile.npub = npub;
  const { data: fetchedProfile } = useProfile({
    pubkey: pk,
    enabled: !!pk,
  });
  const profile = fetchedProfile || cachedProfile;

  useEffect(() => {
    if (profile) {
      dispatch(setAuthUser(profile));
    }
  }, [profile?.npub]);

  return <></>;
}

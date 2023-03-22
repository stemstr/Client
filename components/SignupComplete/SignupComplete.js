import { getPublicKey, nip19 } from "nostr-tools";
import { useMemo } from "react";

export default function SignupComplete({ sk }) {
  const nsec = useMemo(() => nip19.nsecEncode(sk), [sk]);
  const pk = useMemo(() => getPublicKey(sk), [sk]);
  const npub = useMemo(() => nip19.npubEncode(pk), [pk]);

  return <>{nsec}</>;
}

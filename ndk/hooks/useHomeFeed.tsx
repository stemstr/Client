import { useMemo } from "react";
import { useFeed } from "./useFeed";
import { Kind } from "nostr-tools";
import { NDKFilter } from "@nostr-dev-kit/ndk";
import useContactList from "./useContactList";
import { useSelector } from "react-redux";
import { AppState } from "store/Store";

export function useHomeFeed() {
  const authState = useSelector((state: AppState) => state.auth);
  const contactList = useContactList({ hexpubkey: authState.pk });
  const queriedAuthors = useMemo(() => {
    let pubkeys = [...contactList.values()].map((user) => user.hexpubkey());
    if (authState.pk && !pubkeys.some((pubkey) => pubkey === authState.pk))
      pubkeys = [authState.pk, ...pubkeys];
    // TODO: remove limit
    return pubkeys.slice(0, 500);
  }, [contactList.size]);
  const filter = useMemo<NDKFilter>(
    () => ({
      kinds: [1, 1808 as Kind],
      limit: 100,
      authors: queriedAuthors,
    }),
    [queriedAuthors]
  );
  const events = useFeed(filter, [
    process.env.NEXT_PUBLIC_STEMSTR_RELAY as string,
  ]);

  return events;
}

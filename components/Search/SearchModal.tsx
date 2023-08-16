import { Modal, ModalProps, TextInput } from "@mantine/core";
import { NDKEvent, mergeEvent } from "@nostr-dev-kit/ndk";
import { SearchIcon } from "icons/StemstrIcon";
import { useNDK } from "ndk/NDKProvider";
import { profileEventsCache } from "ndk/inMemoryCacheAdapter";
import { useEffect, useState } from "react";
import SearchResults from "./SearchResults";

export default function SearchModal(props: ModalProps) {
  const { ndk } = useNDK();
  const [query, setQuery] = useState("");
  const [profilePubkeyResults, setProfilePubkeyResults] = useState<string[]>(
    []
  );

  const fetchProfiles = () => {
    if (!query) {
      setProfilePubkeyResults([]);
      return;
    }
    const normalizedQuery = query.toLowerCase();
    const pubkeys: string[] = [];

    for (const key in profileEventsCache) {
      if (profileEventsCache.hasOwnProperty(key)) {
        const ndkEvent = new NDKEvent(ndk, profileEventsCache[key]);
        const ndkUser = ndkEvent.author;
        ndkUser.profile = mergeEvent(ndkEvent, {});
        if (
          ndkUser.profile?.name?.toLowerCase().includes(normalizedQuery) ||
          ndkUser.profile?.displayName?.toLowerCase().includes(normalizedQuery)
        )
          pubkeys.push(ndkUser.hexpubkey());
      }
    }

    setProfilePubkeyResults(pubkeys);
  };

  useEffect(() => {
    fetchProfiles();
  }, [query]);

  return (
    <Modal
      title={
        <TextInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search profiles and hashtags"
          icon={<SearchIcon width={16} height={16} />}
          styles={(theme) => ({
            input: {
              backgroundColor: theme.colors.dark[8],
              "&::placeholder": {
                color: theme.colors.dark[2],
              },
            },
          })}
        />
      }
      styles={{ title: { flexGrow: 1 } }}
      closeButtonLabel="Cancel"
      fullScreen
      {...props}
    >
      <SearchResults profilePubkeyResults={profilePubkeyResults} />
    </Modal>
  );
}

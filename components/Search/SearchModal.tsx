import {
  Button,
  Group,
  Modal,
  ModalProps,
  Space,
  TextInput,
} from "@mantine/core";
import { NDKEvent, mergeEvent } from "@nostr-dev-kit/ndk";
import { SearchIcon } from "icons/StemstrIcon";
import { useNDK } from "ndk/NDKProvider";
import { profileEventsCache } from "ndk/inMemoryCacheAdapter";
import { useEffect, useState } from "react";
import SearchResults from "./SearchResults";
import useFooterHeight from "ndk/hooks/useFooterHeight";

export default function SearchModal(props: ModalProps) {
  const { ndk } = useNDK();
  const [query, setQuery] = useState("");
  const [profilePubkeyResults, setProfilePubkeyResults] = useState<string[]>(
    []
  );
  const footerHeight = useFooterHeight();

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
        <Group>
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search profiles and hashtags"
            icon={<SearchIcon width={16} height={16} />}
            styles={(theme) => ({
              root: {
                flexGrow: 1,
              },
              icon: {
                color: theme.colors.gray[2],
              },
              input: {
                backgroundColor: theme.colors.gray[9],
                "&::placeholder": {
                  color: theme.colors.gray[2],
                },
              },
            })}
            aria-label="Search profiles and hashtags"
          />
          <Button
            onClick={props.onClose}
            variant="light"
            px={16}
            aria-label="Cancel search"
          >
            Cancel
          </Button>
        </Group>
      }
      styles={{
        modal: {
          maxWidth: 600,
          margin: "auto",
        },
        header: { marginRight: 0 },
        title: { width: "100%", marginRight: 0 },
      }}
      zIndex={99}
      withCloseButton={false}
      fullScreen
      {...props}
    >
      <SearchResults profilePubkeyResults={profilePubkeyResults} />
      <Space h={footerHeight} />
    </Modal>
  );
}

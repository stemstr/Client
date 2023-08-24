import { Modal, ModalProps, Space, Transition } from "@mantine/core";
import { NDKEvent, mergeEvent } from "@nostr-dev-kit/ndk";
import { useNDK } from "ndk/NDKProvider";
import { profileEventsCache } from "ndk/inMemoryCacheAdapter";
import { useEffect, useState } from "react";
import SearchResults from "./SearchResults";
import useFooterHeight from "ndk/hooks/useFooterHeight";
import { useDebouncedValue } from "@mantine/hooks";
import SearchBar from "./SearchBar";
import { useRouter } from "next/router";

export default function SearchModal(props: ModalProps) {
  const { ndk } = useNDK();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [profilePubkeyResults, setProfilePubkeyResults] = useState<string[]>(
    []
  );
  const footerHeight = useFooterHeight();
  const [searchBarMounted] = useDebouncedValue(props.opened, 100);
  const [searchResultsMounted] = useDebouncedValue(props.opened, 300);

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

  const handleClose = () => {
    props.onClose();
    setQuery("");
  };

  useEffect(() => {
    fetchProfiles();
  }, [query]);

  useEffect(() => {
    const handleRouteChange = (url: any) => {
      handleClose();
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, handleClose]);

  return (
    <Modal
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
      <Transition
        mounted={searchBarMounted}
        transition="pop"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <SearchBar
            query={query}
            setQuery={setQuery}
            onClose={handleClose}
            style={styles}
            mb={24}
          />
        )}
      </Transition>
      <Transition
        mounted={searchResultsMounted}
        transition="pop"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <SearchResults
            query={query}
            profilePubkeyResults={profilePubkeyResults}
            style={styles}
          />
        )}
      </Transition>
      <Space h={footerHeight} />
    </Modal>
  );
}

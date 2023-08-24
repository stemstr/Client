import { ActionIcon, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SearchIcon } from "icons/StemstrIcon";
import SearchModal from "./SearchModal";
import { useNDK } from "ndk/NDKProvider";
import { useEffect } from "react";
import { NDKSubscription } from "@nostr-dev-kit/ndk";
import { Kind } from "nostr-tools";

export default function SearchButton() {
  const { ndk, stemstrRelaySet } = useNDK();
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    let sub: NDKSubscription | undefined;

    if (opened) {
      sub = ndk?.subscribe(
        {
          kinds: [Kind.Metadata],
        },
        undefined,
        stemstrRelaySet
      );
      sub?.start();
    }

    return () => {
      if (sub) {
        sub.stop();
      }
    };
  }, [opened]);

  return (
    <Box>
      <SearchModal opened={opened} onClose={close} />
      <ActionIcon onClick={open} variant="transparent">
        <SearchIcon color="white" width={24} height={24} />
      </ActionIcon>
    </Box>
  );
}

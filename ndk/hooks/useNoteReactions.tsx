import { useMemo } from "react";
import { useFeed } from "./useFeed";
import { Kind } from "nostr-tools";
import { NDKFilter } from "@nostr-dev-kit/ndk";
import { useEvent } from "../NDKEventProvider";

export function useNoteReactions() {
  const { event } = useEvent();
  const reactionsFilter = useMemo<NDKFilter>(
    () => ({
      kinds: [Kind.Reaction],
      "#e": [event.id],
    }),
    []
  );

  return useFeed(reactionsFilter);
}

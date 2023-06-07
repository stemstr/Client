import { NDKEvent } from "@nostr-dev-kit/ndk";

export type NoteTreeNode = {
  event: NDKEvent;
  children: NoteTreeNode[];
};

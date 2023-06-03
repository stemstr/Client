import { NDKEvent } from "@nostr-dev-kit/ndk";

export type Note = {
  event: NDKEvent;
  reactions: NDKEvent[];
};

export type NoteTreeNode = {
  event: NDKEvent;
  children: NoteTreeNode[];
};

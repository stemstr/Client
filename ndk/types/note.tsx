import { NDKEvent } from "@nostr-dev-kit/ndk";

export type Note = {
  event: NDKEvent;
};

export type NoteTreeNode = {
  note: Note;
  children: NoteTreeNode[];
};

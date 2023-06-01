import { NDKEvent } from "@nostr-dev-kit/ndk";

export type Note = {
  event: NDKEvent;
  reactions: NDKEvent[];
};

export type NoteTreeNode = {
  note: Note;
  children: NoteTreeNode[];
};

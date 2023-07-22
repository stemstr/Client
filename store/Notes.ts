import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./Store";

interface NoteMetada {
  reactionCount: number;
  isLikedByCurrentUser: boolean;
  commentCount: number;
  repostCount: number;
  isRepostedByCurrentUser: boolean;
  zapsAmountTotal: number;
  isZappedByCurrentUser: boolean;
}

const defaultNoteMetadata: NoteMetada = {
  reactionCount: 0,
  isLikedByCurrentUser: false,
  commentCount: 0,
  repostCount: 0,
  isRepostedByCurrentUser: false,
  zapsAmountTotal: 0,
  isZappedByCurrentUser: false,
};

interface NotesState {
  [noteId: string]: NoteMetada;
}

const initialState: NotesState = {};

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setReactionCount: (
      state,
      action: PayloadAction<{ id: string; value: number }>
    ) => {
      const { id, value } = action.payload;

      state[id] = {
        ...defaultNoteMetadata,
        ...state[id],
        reactionCount: value,
      };
    },
    setRepostCount: (
      state,
      action: PayloadAction<{ id: string; value: number }>
    ) => {
      const { id, value } = action.payload;

      state[id] = {
        ...defaultNoteMetadata,
        ...state[id],
        repostCount: value,
      };
    },
    setIsLikedByCurrentUser: (
      state,
      action: PayloadAction<{ id: string; value: boolean }>
    ) => {
      const { id, value } = action.payload;

      state[id] = {
        ...defaultNoteMetadata,
        ...state[id],
        isLikedByCurrentUser: value,
      };
    },
    setIsRepostedByCurrentUser: (
      state,
      action: PayloadAction<{ id: string; value: boolean }>
    ) => {
      const { id, value } = action.payload;

      state[id] = {
        ...defaultNoteMetadata,
        ...state[id],
        isRepostedByCurrentUser: value,
      };
    },
    setCommentCount: (
      state,
      action: PayloadAction<{ id: string; value: number }>
    ) => {
      const { id, value } = action.payload;

      state[id] = { ...defaultNoteMetadata, ...state[id], commentCount: value };
    },
    setZapsAmountTotal: (
      state,
      action: PayloadAction<{ id: string; value: number }>
    ) => {
      const { id, value } = action.payload;

      state[id] = {
        ...defaultNoteMetadata,
        ...state[id],
        zapsAmountTotal: value,
      };
    },
    currentUserLikedNote: (state, action: PayloadAction<string>) => {
      const id = action.payload;

      state[id] = {
        ...defaultNoteMetadata,
        ...state[id],
        isLikedByCurrentUser: true,
        reactionCount: state[id] ? state[id].reactionCount + 1 : 1,
      };
    },
    updateZapsAmountTotal: (
      state,
      action: PayloadAction<{ id: string; value: number }>
    ) => {
      const { id, value } = action.payload;

      state[id] = {
        ...defaultNoteMetadata,
        ...state[id],
        zapsAmountTotal: state[id] ? state[id].zapsAmountTotal + value : value,
      };
    },
    setIsZappedByCurrentUser: (
      state,
      action: PayloadAction<{ id: string; value: boolean }>
    ) => {
      const { id, value } = action.payload;

      state[id] = {
        ...defaultNoteMetadata,
        ...state[id],
        isZappedByCurrentUser: value,
      };
    },
  },
});

export const {
  setReactionCount,
  setIsLikedByCurrentUser,
  setIsRepostedByCurrentUser,
  currentUserLikedNote,
  setCommentCount,
  setRepostCount,
  setZapsAmountTotal,
  updateZapsAmountTotal,
  setIsZappedByCurrentUser,
} = notesSlice.actions;

export const selectNoteState = (state: AppState, noteId: string) =>
  state.notes[noteId] ?? defaultNoteMetadata;

export default notesSlice.reducer;

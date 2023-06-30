import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./Store";

interface NoteMetada {
  reactionCount: number;
  isLikedByCurrentUser: boolean;
  commentCount: number;
  zapsAmountTotal: number;
}

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

      state[id] = { ...state[id], reactionCount: value };
    },
    setIsLikedByCurrentUser: (
      state,
      action: PayloadAction<{ id: string; value: boolean }>
    ) => {
      const { id, value } = action.payload;

      state[id] = { ...state[id], isLikedByCurrentUser: value };
    },
    setCommentCount: (
      state,
      action: PayloadAction<{ id: string; value: number }>
    ) => {
      const { id, value } = action.payload;

      state[id] = { ...state[id], commentCount: value };
    },
    setZapsAmountTotal: (
      state,
      action: PayloadAction<{ id: string; value: number }>
    ) => {
      const { id, value } = action.payload;

      state[id] = { ...state[id], zapsAmountTotal: value };
    },
    currentUserLikedNote: (state, action: PayloadAction<string>) => {
      const id = action.payload;

      state[id] = {
        ...state[id],
        isLikedByCurrentUser: true,
        reactionCount: state[id] ? state[id].reactionCount + 1 : 1,
      };
    },
  },
});

export const {
  setReactionCount,
  setIsLikedByCurrentUser,
  currentUserLikedNote,
  setCommentCount,
  setZapsAmountTotal,
} = notesSlice.actions;

export const selectNoteState = (state: AppState, noteId: string) =>
  state.notes[noteId] ?? {
    reactionCount: 0,
    isLikedByCurrentUser: false,
    commentCount: 0,
    zapsAmountTotal: 0,
  };

export default notesSlice.reducer;

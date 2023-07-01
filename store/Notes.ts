import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./Store";

interface NoteMetada {
  reactionCount: number;
  isLikedByCurrentUser: boolean;
  commentCount: number;
  zapsAmountTotal: number;
  hasInitialLoadCompleted: boolean;
}

const defaultNoteMetadata: NoteMetada = {
  reactionCount: 0,
  isLikedByCurrentUser: false,
  commentCount: 0,
  zapsAmountTotal: 0,
  hasInitialLoadCompleted: false,
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
    setHasInitialLoadCompleted: (state, action: PayloadAction<string>) => {
      const id = action.payload;

      state[id] = {
        ...defaultNoteMetadata,
        ...state[id],
        hasInitialLoadCompleted: true,
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
  },
});

export const {
  setReactionCount,
  setIsLikedByCurrentUser,
  currentUserLikedNote,
  setCommentCount,
  setZapsAmountTotal,
  setHasInitialLoadCompleted,
  updateZapsAmountTotal,
} = notesSlice.actions;

export const selectNoteState = (state: AppState, noteId: string) =>
  state.notes[noteId] ?? defaultNoteMetadata;

export default notesSlice.reducer;

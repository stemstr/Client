import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./Store";

export const createNip05StatusKey = (pubkey: string, nip05: string) => {
  return `${pubkey}/${nip05}`;
};

export enum Nip05Status {
  Valid = 1,
  Invalid = 2,
}

interface Nip05State {
  [key: string]: Nip05Status;
}

const initialState: Nip05State = {};

export const nip05Slice = createSlice({
  name: "nip05",
  initialState,
  reducers: {
    setNip05Status: (
      state,
      action: PayloadAction<{ key: string; value: Nip05Status }>
    ) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

export const { setNip05Status } = nip05Slice.actions;
export const selectNip05State = (state: AppState) => state.nip05;
export default nip05Slice.reducer;

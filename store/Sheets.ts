import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SheetKey = "postSheet";

interface SheetsState {
  postSheet: boolean;
}

const initialState: SheetsState = {
  postSheet: false,
};

export const sheetsSlice = createSlice({
  name: "sheets",
  initialState,
  reducers: {
    openSheet: (state, action: PayloadAction<SheetKey>) => {
      state[action.payload] = true;
    },
    closeSheet: (state, action: PayloadAction<SheetKey>) => {
      state[action.payload] = false;
    },
  },
});

export const { openSheet, closeSheet } = sheetsSlice.actions;
export default sheetsSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SheetKey = "shareSheet";

interface SheetsState {
  shareSheet: boolean;
}

const initialState: SheetsState = {
  shareSheet: false,
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

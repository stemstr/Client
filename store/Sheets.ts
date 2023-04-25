import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Event } from "nostr-tools";

type SheetKey = "postSheet";

interface SheetsState {
  postSheet: {
    isOpen: boolean;
    replyingTo?: Event;
  };
}

const initialState: SheetsState = {
  postSheet: {
    isOpen: false,
  },
};

interface OpenSheetPayload {
  sheetKey: SheetKey;
  replyingTo?: Event;
}

export const sheetsSlice = createSlice({
  name: "sheets",
  initialState,
  reducers: {
    openSheet: (state, action: PayloadAction<OpenSheetPayload>) => {
      const { sheetKey, replyingTo } = action.payload;
      state[sheetKey].isOpen = true;
      state[sheetKey].replyingTo = replyingTo;
    },
    closeSheet: (state, action: PayloadAction<SheetKey>) => {
      state[action.payload].isOpen = false;
      state[action.payload].replyingTo = undefined;
    },
  },
});

export const { openSheet, closeSheet } = sheetsSlice.actions;
export default sheetsSlice.reducer;

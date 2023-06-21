import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type NostrEvent } from "@nostr-dev-kit/ndk";

type SheetKey = "postSheet";

interface SheetsState {
  postSheet: {
    isOpen: boolean;
    replyingTo?: NostrEvent;
  };
}

const initialState: SheetsState = {
  postSheet: {
    isOpen: false,
  },
};

interface OpenSheetPayload {
  sheetKey: SheetKey;
  replyingTo?: NostrEvent;
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

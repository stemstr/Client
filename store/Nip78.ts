import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./Store";
import { DEFAULT_LIGHTNING_WALLETS } from "../constants";

export interface UserPreferences {
  defaultLightningWallet?: keyof typeof DEFAULT_LIGHTNING_WALLETS;
}

interface Nip78State {
  hasCompletedInitialFetch: boolean;
  userPreferences: UserPreferences;
}

const initialState: Nip78State = {
  hasCompletedInitialFetch: false,
  userPreferences: {},
};

export const nip78Slice = createSlice({
  name: "nip78",
  initialState,
  reducers: {
    setUserPreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.userPreferences = action.payload;
    },
    setHasCompletedInitialFetch: (state, action: PayloadAction<boolean>) => {
      state.hasCompletedInitialFetch = action.payload;
    },
  },
});

export const { setUserPreferences, setHasCompletedInitialFetch } =
  nip78Slice.actions;
export const selectNip78State = (state: AppState) => state.nip78;
export default nip78Slice.reducer;

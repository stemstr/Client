import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./Store";
import { UserPreferences } from "../utils/userPreferences";

interface UserPreferencesState {
  userPreferences: UserPreferences;
}

const initialState: UserPreferencesState = {
  userPreferences: {},
};

export const userPreferencesSlice = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    setUserPreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.userPreferences = action.payload;
    },
  },
});

export const { setUserPreferences } = userPreferencesSlice.actions;
export const selectUserPreferencesState = (state: AppState) =>
  state.userPreferences;
export default userPreferencesSlice.reducer;

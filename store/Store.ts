import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { usersSlice } from "./Users";
import { createWrapper } from "next-redux-wrapper";
import { authSlice } from "./Auth";
import { sheetsSlice } from "./Sheets";
import { relaysSlice } from "./Relays";
import { eventsSlice } from "./Events";
import { nip05Slice } from "./Nip05";
import { notesSlice } from "./Notes";
import { userPreferencesSlice } from "./UserPreferences";
import { searchHistorySlice } from "./SearchHistory";

const makeStore = () =>
  configureStore({
    reducer: {
      [usersSlice.name]: usersSlice.reducer,
      [authSlice.name]: authSlice.reducer,
      [sheetsSlice.name]: sheetsSlice.reducer,
      [relaysSlice.name]: relaysSlice.reducer,
      [eventsSlice.name]: eventsSlice.reducer,
      [nip05Slice.name]: nip05Slice.reducer,
      [notesSlice.name]: notesSlice.reducer,
      [userPreferencesSlice.name]: userPreferencesSlice.reducer,
      [searchHistorySlice.name]: searchHistorySlice.reducer,
    },
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const reduxWrapper = createWrapper<AppStore>(makeStore);

import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { usersSlice } from "./Users";
import { createWrapper } from "next-redux-wrapper";

const makeStore = () =>
  configureStore({
    reducer: {
      [usersSlice.name]: usersSlice.reducer,
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

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "./Store";
import { HYDRATE } from "next-redux-wrapper";
import { cacheSearchHistoryState } from "cache/cache";

export type SearchResultType = "hashtag" | "profile";

type SearchHistoryItem = {
  type: SearchResultType;
  data: string; // #hashtag, hexpubkey, etc.
  timestamp: number; // unix time in seconds
};

// Type for our state
export interface SearchHistoryState {
  history: SearchHistoryItem[];
}

// Initial state
const initialState: SearchHistoryState = { history: [] };

// Actual Slice
export const searchHistorySlice = createSlice({
  name: "searchHistory",
  initialState,
  reducers: {
    setSearchHistoryState: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    addSearchHistoryItem: (state, action: PayloadAction<SearchHistoryItem>) => {
      const updatedHistory = [
        ...state.history.filter(
          (item) =>
            !(
              item.type === action.payload.type &&
              item.data === action.payload.data
            )
        ),
        action.payload,
      ];
      updatedHistory.sort((a, b) => b.timestamp - a.timestamp);

      state.history = updatedHistory;
      cacheSearchHistoryState(state);
    },
    reset: () => {
      cacheSearchHistoryState(null);
      return initialState;
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.searchHistory,
      };
    },
  },
});

export const { setSearchHistoryState, addSearchHistoryItem, reset } =
  searchHistorySlice.actions;

export const selectSearchHistoryState = (state: AppState) =>
  state.searchHistory;

export default searchHistorySlice.reducer;

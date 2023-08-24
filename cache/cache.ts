import { SearchHistoryState } from "store/SearchHistory";
import { AuthState } from "../store/Auth";

const AUTH_KEY = "stemstr:cachedAuth";
const SEARCH_HISTORY_KEY = "stemstr:cachesSearchHistory";

export const cacheAuthState = (state: AuthState | null) => {
  if (state === null) {
    localStorage.removeItem(AUTH_KEY);
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(state));
};

export const getCachedAuthState = () => {
  const localStorageData = localStorage.getItem(AUTH_KEY);

  if (!localStorageData) return null;

  const auth = JSON.parse(localStorageData);

  return auth;
};

export const cacheSearchHistoryState = (state: SearchHistoryState | null) => {
  if (state === null) {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  }
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(state));
};

export const getCachedSearchHistoryState = () => {
  const localStorageData = localStorage.getItem(SEARCH_HISTORY_KEY);

  if (!localStorageData) return null;

  const searchHistory = JSON.parse(localStorageData);

  return searchHistory;
};

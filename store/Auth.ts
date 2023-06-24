import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./Store";
import { HYDRATE } from "next-redux-wrapper";
import { nip19, getPublicKey } from "nostr-tools";
import { cacheAuthState } from "../cache/cache";
import { getPublicKeys } from "../ndk/utils";

// Type for our state
export interface AuthState {
  type?: "privatekey" | "nip07";
  sk?: string;
  pk?: string;
  isNewlyCreatedUser?: boolean;
}

export function isAuthState(object: any) {
  if (!object) return false;
  return "type" in object;
}

// Initial state
const initialState: AuthState = {};

// Actual Slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setSK: (state, action) => {
      // TODO: Validate keys
      let sk, nsec, pk, npub;
      if (action.payload.startsWith("nsec")) {
        let { type, data } = nip19.decode(action.payload);
        if (typeof data === "string") {
          sk = data;
        }
      } else {
        sk = action.payload;
      }
      pk = getPublicKey(sk);
      // npub = nip19.npubEncode(pk);
      state.type = "privatekey";
      state.sk = sk;
      state.pk = pk;
      cacheAuthState(state);
    },
    setNIP07: (state, action) => {
      Object.assign(state, initialState);
      // payload is user's pubkey
      const { pk, npub } = getPublicKeys(action.payload);
      state.type = "nip07";
      state.sk = undefined;
      state.pk = pk;
      cacheAuthState(state);
    },
    setIsNewlyCreatedUser: (state, action) => {
      state.isNewlyCreatedUser = action.payload;
      cacheAuthState(state);
    },
    reset: () => {
      cacheAuthState(null);
      return initialState;
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const { setSK, reset, setAuthState, setNIP07, setIsNewlyCreatedUser } =
  authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth;

export default authSlice.reducer;

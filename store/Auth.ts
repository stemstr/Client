import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./Store";
import { HYDRATE } from "next-redux-wrapper";
import { User } from "./Users";
import { nip19, getPublicKey } from "nostr-tools";
import { cacheAuthState } from "../cache/cache";
import { getPublicKeys } from "../nostr/utils";

// Type for our state
export interface AuthState {
  nip07: boolean;
  sk?: string | null; // hex
  nsec?: string | null;
  user: User;
}

// Initial state
const initialState: AuthState = {
  nip07: false,
  sk: null,
  nsec: null,
  user: {
    pk: "",
    npub: "",
    metadata: {},
  },
};

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
          nsec = action.payload;
        }
      } else {
        nsec = nip19.nsecEncode(action.payload);
        sk = action.payload;
      }
      pk = getPublicKey(sk);
      npub = nip19.npubEncode(pk);
      state.sk = sk;
      state.nsec = nsec;
      state.user.pk = pk;
      state.user.npub = npub;
      cacheAuthState(state);
    },
    setNIP07: (state, action) => {
      Object.assign(state, initialState);
      state.nip07 = true;
      // payload is user's pubkey
      const { pk, npub } = getPublicKeys(action.payload);
      state.user.pk = pk;
      state.user.npub = npub;
      cacheAuthState(state);
    },
    setAuthUser: (state, action) => {
      let user = action.payload;
      let { type, data } = nip19.decode(user.npub);
      user.pk = data;
      state.user = user;
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

export const { setSK, setAuthUser, reset, setAuthState, setNIP07 } =
  authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth;

export default authSlice.reducer;

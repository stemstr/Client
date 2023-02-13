import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./Store";
import { HYDRATE } from "next-redux-wrapper";
import { User, usersSlice } from "./Users";
import { nip19, getPublicKey } from "nostr-tools";

// Type for our state
export interface AuthState {
  sk: string | null; // hex
  nsec: string | null;
  user: User;
}

// Initial state
const initialState: AuthState = {
  sk: null,
  nsec: null,
  user: {
    pk: "",
    npub: "",
  },
};

// Actual Slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
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
    },
    setAuthUser: (state, action) => {
      let user = action.payload;
      let { type, data } = nip19.decode(user.npub);
      user.pk = data;
      state.user = user;
    },
    reset: () => initialState,
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

export const { setSK, setAuthUser, reset } = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth;

export default authSlice.reducer;

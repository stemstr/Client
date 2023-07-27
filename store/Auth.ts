import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "./Store";
import { HYDRATE } from "next-redux-wrapper";
import { nip19, getPublicKey } from "nostr-tools";
import { cacheAuthState } from "../cache/cache";
import { getPublicKeys } from "../ndk/utils";
import axios, { AxiosError } from "axios";

type StemstrSubscriptionStatus = {
  expires_at: number; // unix time in seconds
};

// Type for our state
export interface AuthState {
  type?: "privatekey" | "nip07";
  sk?: string;
  pk?: string;
  isNewlyCreatedUser?: boolean;
  subscriptionStatus?: StemstrSubscriptionStatus;
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
    setSK: (state, action: PayloadAction<string>) => {
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
      if (!sk) throw new Error("invalid secret key");
      pk = getPublicKey(sk);
      // npub = nip19.npubEncode(pk);
      state.type = "privatekey";
      state.sk = sk;
      state.pk = pk;
      cacheAuthState(state);
    },
    setNIP07: (state, action: PayloadAction<string>) => {
      Object.assign(state, initialState);
      // payload is user's pubkey
      const { pk, npub } = getPublicKeys(action.payload);
      state.type = "nip07";
      state.sk = undefined;
      state.pk = pk;
      cacheAuthState(state);
    },
    setIsNewlyCreatedUser: (state, action: PayloadAction<boolean>) => {
      state.isNewlyCreatedUser = action.payload;
      cacheAuthState(state);
    },
    setSubscriptionStatus: (
      state,
      action: PayloadAction<StemstrSubscriptionStatus | undefined>
    ) => {
      state.subscriptionStatus = action.payload;
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

export const {
  setSK,
  reset,
  setAuthState,
  setNIP07,
  setIsNewlyCreatedUser,
  setSubscriptionStatus,
} = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth;

export default authSlice.reducer;

export const fetchSubscriptionStatus = (
  pubkey: string
): Promise<StemstrSubscriptionStatus> => {
  return new Promise((resolve, reject) => {
    if (!pubkey) reject("no pubkey");
    axios
      .get(`${process.env.NEXT_PUBLIC_STEMSTR_API}/subscription/${pubkey}`)
      .then((response) => {
        try {
          if (response.data.expires_at !== undefined) {
            const subscriptionStatus = { expires_at: response.data.expires_at };
            resolve(subscriptionStatus);
          } else {
            reject("invalid reponse");
          }
        } catch (err) {
          reject(err);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

type FetchSubscriptionInvoiceResponse = {
  created_at: number;
  days: number;
  expires_at: number;
  lightning_invoice: string;
};

export const fetchSubscriptionInvoice = (
  pubkey: string,
  days: number
): Promise<FetchSubscriptionInvoiceResponse> => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_STEMSTR_API}/subscription/${pubkey}?days=${days}`
      )
      .catch((err: AxiosError) => {
        if (err.response) {
          if (err.response.status === 402) {
            const data = err.response.data as FetchSubscriptionInvoiceResponse;
            if (data.lightning_invoice) {
              resolve(data);
            } else {
              reject("no invoice found");
            }
          } else if (err.response.status === 409) {
            reject("Conflict: user has an active subscription");
          } else {
            reject(err);
          }
        } else {
          reject(err.message);
        }
      });
  });
};

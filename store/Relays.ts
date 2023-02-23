import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { relayInit, Relay } from "nostr-tools";

interface RelaysState {
  stemstrRelay: string;
}

const initialState: RelaysState = {
  stemstrRelay: process.env.NEXT_PUBLIC_STEMSTR_RELAY!,
};

export const relaysSlice = createSlice({
  name: "relays",
  initialState,
  reducers: {},
});

export default relaysSlice.reducer;

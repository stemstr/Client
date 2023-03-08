import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./Store";
import { HYDRATE } from "next-redux-wrapper";
import { Event, Kind } from "nostr-tools";

export interface TaggedEvent extends Event {
  /**
   * A list of relays this event was seen on
   */
  relays: string[];
}

type KindMap<T> = { [K in keyof typeof Kind]?: T[] };

// Type for our state
interface EventsCache extends KindMap<TaggedEvent> {}

// Initial state
const initialState: EventsCache = {
  [Kind.Metadata]: [],
  [Kind.Text]: [],
  [Kind.RecommendRelay]: [],
  [Kind.Contacts]: [],
  [Kind.Reaction]: [],
  [Kind.ZapRequest]: [],
  [Kind.Zap]: [],
};

// Actual Slice
export const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state, action) => {
      const kind = action.payload.kind as Kind;
      if (kind in Kind) {
        state[kind]?.push(action.payload);
      }
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.events,
      };
    },
  },
});

export const { addEvent } = eventsSlice.actions;

export const selectEvents = (state: AppState) => state.events;

export default eventsSlice.reducer;

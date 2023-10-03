export const DEFAULT_RELAY_URLS: string[] = [
  // // paid relays
  "wss://eden.nostr.land",
  "wss://puravida.nostr.land",
  // "wss://nostr.milou.lol",
  "wss://nostr.wine",
  // // public relays
  "wss://relay.damus.io",
  "wss://relay.snort.social",
  "wss://nos.lol",
  "wss://relay.current.fyi",
  "wss://relay.nostr.band",
  // specialized relays
  "wss://purplepag.es",
  "wss://filter.nostr.wine",
];

export const NPUB_NOSTR_URI_REGEX =
  /(nostr:npub1[023456789acdefghjklmnpqrstuvwxyz]{58})/g;

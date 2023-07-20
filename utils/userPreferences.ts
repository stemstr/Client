import localforage from "localforage";

const userPreferencesKey = "stemstr:userPreferences";
export const DEFAULT_LIGHTNING_WALLETS = {
  strike: { displayName: "Strike", uriPrefix: "strike:lightning:" },
  cashapp: {
    displayName: "Cash App",
    uriPrefix: "https://cash.app/launch/lightning/",
  },
  muun: { displayName: "Muun", uriPrefix: "muun:" },
  bluewallet: {
    displayName: "Blue Wallet",
    uriPrefix: "bluewallet:lightning:",
  },
  walletofsatoshi: {
    displayName: "Wallet of Satoshi",
    uriPrefix: "walletofsatoshi:lightning:",
  },
  zebedee: { displayName: "Zebedee", uriPrefix: "zebedee:lightning:" },
  zeusln: { displayName: "Zeus LN", uriPrefix: "zeusln:lightning:" },
  lnlink: { displayName: "LNLink", uriPrefix: "lnlink:lightning:" },
  phoenix: { displayName: "Phoenix", uriPrefix: "phoenix://" },
  breez: { displayName: "Breez", uriPrefix: "breez:" },
  bitcoinbeach: { displayName: "Bitcoin Beach", uriPrefix: "bitcoinbeach://" },
  blixtwallet: {
    displayName: "Blixt Wallet",
    uriPrefix: "blixtwallet:lightning:",
  },
  river: { displayName: "River", uriPrefix: "river://" },
};

export interface UserPreferences {
  defaultLightningWallet?: keyof typeof DEFAULT_LIGHTNING_WALLETS;
}

export const getUserPreferences = () =>
  localforage.getItem<UserPreferences>(userPreferencesKey);

export const setUserPreferences = (userPreferences: UserPreferences) =>
  localforage.setItem(userPreferencesKey, userPreferences);

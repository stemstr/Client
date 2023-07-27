import { DEFAULT_LIGHTNING_WALLETS } from "../utils/userPreferences";
import { useSelector } from "react-redux";
import { selectUserPreferencesState } from "../store/UserPreferences";

export default function useLightningWalletUri(invoice: string) {
  const { userPreferences } = useSelector(selectUserPreferencesState);
  const { uriPrefix = "lightning:" } = userPreferences.defaultLightningWallet
    ? DEFAULT_LIGHTNING_WALLETS[userPreferences.defaultLightningWallet]
    : {};

  return invoice ? `${uriPrefix}${invoice}` : "";
}

import { useSelector } from "react-redux";
import { selectNip78State } from "../store/Nip78";
import { DEFAULT_LIGHTNING_WALLETS } from "../constants";

export default function useLightningWalletUri(invoice: string) {
  const { userPreferences } = useSelector(selectNip78State);
  const { uriPrefix = "lightning:" } = userPreferences.defaultLightningWallet
    ? DEFAULT_LIGHTNING_WALLETS[userPreferences.defaultLightningWallet]
    : {};

  return `${uriPrefix}${invoice}`;
}

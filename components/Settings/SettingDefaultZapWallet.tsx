import { Select } from "@mantine/core";
import SettingsItem from "./SettingsItem";
import { WalletIcon } from "icons/StemstrIcon";
import { DEFAULT_LIGHTNING_WALLETS } from "../../constants";

export function SettingDefaultZapWallet() {
  // TODO: load saved default wallet and save default wallet on selection using nip-78

  return (
    <SettingsItem
      Icon={WalletIcon}
      title="Default zap wallet"
      description={
        <Select
          placeholder="Select wallet"
          data={Object.entries(DEFAULT_LIGHTNING_WALLETS).map(
            ([value, { displayName }]) => ({ value, label: displayName })
          )}
        />
      }
    />
  );
}

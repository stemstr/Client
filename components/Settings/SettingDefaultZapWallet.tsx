import { Select } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import SettingsItem from "./SettingsItem";
import { WalletIcon } from "icons/StemstrIcon";
import {
  DEFAULT_LIGHTNING_WALLETS,
  setUserPreferences,
} from "../../utils/userPreferences";
import {
  selectUserPreferencesState,
  setUserPreferences as setUserPreferencesInStore,
} from "../../store/UserPreferences";

export function SettingDefaultZapWallet() {
  const { userPreferences } = useSelector(selectUserPreferencesState);
  const dispatch = useDispatch();
  const handleChange = (value: keyof typeof DEFAULT_LIGHTNING_WALLETS) => {
    const newUserPreferences = {
      ...userPreferences,
      defaultLightningWallet: value,
    };

    dispatch(setUserPreferencesInStore(newUserPreferences));

    return setUserPreferences(newUserPreferences);
  };

  return (
    <SettingsItem
      Icon={WalletIcon}
      title="Default zap wallet"
      description={
        <Select
          value={userPreferences.defaultLightningWallet}
          placeholder="Select wallet"
          data={Object.entries(DEFAULT_LIGHTNING_WALLETS).map(
            ([value, { displayName }]) => ({ value, label: displayName })
          )}
          onChange={handleChange}
        />
      }
    />
  );
}

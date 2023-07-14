import { Select } from "@mantine/core";
import SettingsItem from "./SettingsItem";
import { WalletIcon } from "icons/StemstrIcon";
import { DEFAULT_LIGHTNING_WALLETS } from "../../constants";
import { useNDK } from "../../ndk/NDKProvider";
import useCurrentUser from "../../hooks/useCurrentUser";
import { createAppDataEventTemplate } from "../../ndk/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  type UserPreferences,
  setUserPreferences,
  selectNip78State,
} from "../../store/Nip78";

export function SettingDefaultZapWallet() {
  const { ndk, stemstrRelaySet } = useNDK();
  const dispatch = useDispatch();
  const currentUser = useCurrentUser();
  const { userPreferences } = useSelector(selectNip78State);
  const handleChange = async (
    value: keyof typeof DEFAULT_LIGHTNING_WALLETS
  ) => {
    if (!currentUser || !ndk?.signer) {
      return;
    }

    const unencryptedContent: UserPreferences = {
      ...userPreferences,
      defaultLightningWallet: value,
    };
    const customAppDataEvent = createAppDataEventTemplate({
      ndk,
      content: await ndk.signer.encrypt(
        currentUser,
        JSON.stringify(unencryptedContent)
      ),
    });

    customAppDataEvent
      .publish(stemstrRelaySet)
      .then(() => dispatch(setUserPreferences(unencryptedContent)))
      .catch(console.error);
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

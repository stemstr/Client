import SettingsItem from "./SettingsItem";
import { LockIcon } from "icons/StemstrIcon";
import { Route } from "enums";
import useAuth from "hooks/useAuth";

export function SettingNsec() {
  const { authState } = useAuth();

  return authState.sk ? (
    <SettingsItem
      Icon={LockIcon}
      title="Secret account login ID"
      description="Never share it, this is your password"
      href={Route.SettingsNsec}
    />
  ) : null;
}

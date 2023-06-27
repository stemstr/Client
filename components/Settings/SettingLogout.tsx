import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import SettingsItem from "./SettingsItem";
import { LogoutIcon } from "icons/StemstrIcon";
import { Route } from "enums";
import { reset as logout } from "store/Auth";

export function SettingLogout() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push(Route.Login);
  };

  return (
    <SettingsItem
      Icon={LogoutIcon}
      title="Logout"
      description="Make sure your private and public keys are saved before login out or your will lose access to this account"
      onClick={handleLogout}
    />
  );
}

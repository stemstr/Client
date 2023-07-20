import SettingsItem from "./SettingsItem";
import { CodeIcon } from "icons/StemstrIcon";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import StemstrSwitch from "components/StemstrSwitch/StemstrSwitch";
import { ChangeEventHandler, useEffect, useState } from "react";
import {
  selectUserPreferencesState,
  setUserPreferences as setUserPreferencesState,
} from "store/UserPreferences";
import { UserPreferences, setUserPreferences } from "utils/userPreferences";

export function SettingDeveloperMode() {
  const dispatch = useDispatch();
  const currentUser = useCurrentUser();
  const { userPreferences } = useSelector(selectUserPreferencesState);
  const [checked, setChecked] = useState(
    userPreferences.isDeveloperModeEnabled
  );

  useEffect(() => {
    setChecked(userPreferences.isDeveloperModeEnabled);
  }, [userPreferences.isDeveloperModeEnabled]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (!currentUser) {
      return;
    }

    const newUserPreferences: UserPreferences = {
      ...userPreferences,
      isDeveloperModeEnabled: event.currentTarget.checked,
    };

    dispatch(setUserPreferencesState(newUserPreferences));
    setUserPreferences(newUserPreferences);
  };

  return (
    <SettingsItem
      Icon={CodeIcon}
      title="Developer mode"
      description="Extra stuff for 1337 h4x0rs"
      extra={<StemstrSwitch onChange={handleChange} checked={checked} />}
    />
  );
}

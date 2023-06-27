import { CheckCircleIcon, CopyIcon, KeyIcon } from "icons/StemstrIcon";
import SettingsItem from "./SettingsItem";
import useAuth from "hooks/useAuth";
import { getPublicKeys } from "ndk/utils";
import { ActionIcon, CopyButton, useMantineTheme } from "@mantine/core";

export function SettingPubkey() {
  const { authState } = useAuth();
  const { npub } = getPublicKeys(authState.pk as string);

  return (
    <SettingsItem
      Icon={KeyIcon}
      title="Public account ID"
      description={npub}
      extra={<CopyNpub value={npub} />}
    />
  );
}

const CopyNpub = ({ value }: { value: string }) => {
  const theme = useMantineTheme();

  return (
    <CopyButton value={value}>
      {({ copied, copy }) => (
        <ActionIcon variant="filled" color="purple.8" onClick={copy}>
          {copied ? (
            <CheckCircleIcon
              color={theme.colors.purple[2]}
              width={16}
              height={16}
            />
          ) : (
            <CopyIcon color={theme.colors.purple[2]} width={16} height={16} />
          )}
        </ActionIcon>
      )}
    </CopyButton>
  );
};

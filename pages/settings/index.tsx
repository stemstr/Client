import { isDesktop } from "react-device-detect";
import { Group, Stack, Text } from "@mantine/core";
import BackButton from "components/BackButton/BackButton";
import { SettingPubkey } from "components/Settings/SettingPubkey";
import { SettingLogout } from "components/Settings/SettingLogout";
import { Route } from "enums";
import useAuth from "hooks/useAuth";
import { ChevronLeftIcon } from "icons/StemstrIcon";
import Head from "next/head";
import { SettingNsec } from "components/Settings/SettingNsec";
import { SettingDefaultZapWallet } from "../../components/Settings/SettingDefaultZapWallet";
import { SettingDeveloperMode } from "components/Settings/SettingDeveloperMode";
import useFooterHeight from "ndk/hooks/useFooterHeight";

export default function Settings() {
  const { guardAuth, isAuthenticated } = useAuth();
  guardAuth();
  const footerHeight = useFooterHeight();

  return isAuthenticated ? (
    <>
      <Head>
        <title>Stemstr - Settings</title>
      </Head>
      <Group p="md" spacing="sm" align="center" c="white">
        <BackButton defaultUrl={Route.Profile}>
          <ChevronLeftIcon width={24} height={24} />
        </BackButton>
        <Text c="white" fw="bold" fz={24} lh="normal">
          Account settings
        </Text>
      </Group>
      <Stack
        pt="md"
        pl="md"
        pr="md"
        pb={footerHeight + 16}
        spacing="sm"
        align="center"
      >
        <SettingPubkey />
        <SettingNsec />
        {/* wallet chooser is only used on mobile */}
        {!isDesktop && <SettingDefaultZapWallet />}
        <SettingDeveloperMode />
        <SettingLogout />
      </Stack>
    </>
  ) : null;
}

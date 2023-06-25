import { Group, Stack, Text } from "@mantine/core";
import BackButton from "components/BackButton/BackButton";
import { SettingLogout } from "components/Settings/SettingLogout";
import { Route } from "enums";
import useAuth from "hooks/useAuth";
import { ChevronLeftIcon } from "icons/StemstrIcon";
import Head from "next/head";

export default function Settings() {
  const { guardAuth, isAuthenticated } = useAuth();
  guardAuth();

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
      <Stack pt="md" pl="md" pr="md" spacing={0} align="center">
        <SettingLogout />
      </Stack>
    </>
  ) : null;
}

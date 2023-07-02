import { useRouter } from "next/router";
import { Group, Text } from "@mantine/core";
import { Route } from "enums";
import { useMemo } from "react";
import { getPublicKeys } from "ndk/utils";
import Head from "next/head";
import BackButton from "components/BackButton/BackButton";
import { ChevronLeftIcon } from "icons/StemstrIcon";
import { useUser } from "ndk/hooks/useUser";
import ContactsTray from "components/ContactsTray/ContactsTray";

export default function Contacts() {
  const router = useRouter();
  const { hexOrNpub, tab } = router.query;
  const { pk, npub } = useMemo(
    () => getPublicKeys(hexOrNpub as string),
    [hexOrNpub]
  );
  const user = useUser(pk);

  const getTitle = () => {
    let title = "Stemstr";
    switch (tab) {
      case "following":
        title += " - Following";
        break;
      case "followers":
        title += " - Followers";
        break;
      case "relays":
        title += " - Relays";
        break;
    }
    if (user?.profile?.displayName) title += ` - ${user.profile.displayName}`;
    return title;
  };

  return (
    <>
      <Head>
        <title>{getTitle()}</title>
      </Head>
      <Group p="md" spacing="sm" align="center" c="white">
        <BackButton defaultUrl={`${Route.User}/${npub}`}>
          <ChevronLeftIcon width={24} height={24} />
        </BackButton>
        <Text c="white" fw="bold" fz={24} lh="normal">
          {user?.profile?.displayName || `${npub.slice(0, 9)}...`}
        </Text>
      </Group>
      <ContactsTray pubkey={pk} tab={tab as string} />
    </>
  );
}

import { Flex, Stack, Text } from "@mantine/core";
import Head from "next/head";
import FeedHeader from "components/FeedHeader/FeedHeader";
import { useRouter } from "next/router";
import { nip19 } from "nostr-tools";
import { Route } from "../../enums";
import { ChevronLeftIcon } from "../../icons/StemstrIcon";
import BackButton from "../../components/BackButton/BackButton";
import PlaylistFeed from "../../components/PlaylistFeed/PlaylistFeed";

const useNip19Address = () => {
  const router = useRouter();
  const { naddr } = router.query;

  try {
    const { type, data } = nip19.decode(naddr as string);

    if (type === "naddr") {
      return data as nip19.AddressPointer;
    }
  } catch (error) {
    console.error(error);
  }
};

export default function Playlist() {
  // the address id should be a slug, but listr.lol uses the title as the id so just going with using the id as the
  // title for now
  const { identifier: playlistTitle, pubkey } = useNip19Address() ?? {};

  if (!playlistTitle) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Stemstr - {playlistTitle}</title>
      </Head>
      <Stack spacing={0}>
        <FeedHeader>
          <Flex gap={12}>
            <BackButton defaultUrl={Route.Home}>
              <ChevronLeftIcon width={24} height={24} />
            </BackButton>
            <Text truncate>{playlistTitle}</Text>
          </Flex>
        </FeedHeader>
        <PlaylistFeed
          key={playlistTitle}
          d={playlistTitle}
          playlistCreatorPubkey={pubkey}
        />
      </Stack>
    </>
  );
}

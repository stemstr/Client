import { Stack } from "@mantine/core";
import Head from "next/head";
import DiscoverFeedHeader from "components/DiscoverFeedHeader/DiscoverFeedHeader";
import DiscoverFeed from "components/DiscoverFeed/DiscoverFeed";
import { MaxWidthContainer } from "../components/Feed";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Stemstr - Discover</title>
      </Head>
      <Stack spacing={0}>
        <MaxWidthContainer>
          <DiscoverFeedHeader />
        </MaxWidthContainer>
        <DiscoverFeed />
      </Stack>
    </>
  );
}

import { Box, Stack } from "@mantine/core";
import Head from "next/head";
import DiscoverFeedHeader from "components/DiscoverFeedHeader/DiscoverFeedHeader";
import DiscoverFeed from "components/DiscoverFeed/DiscoverFeed";
import DiscoverFeedChips from "components/DiscoverFeedChips/DiscoverFeedChips";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Stemstr - Discover</title>
      </Head>
      <Stack spacing={0}>
        <Box m="auto" pl="md" pr="md" w="100%" sx={{ maxWidth: 600 }}>
          <DiscoverFeedHeader />
        </Box>
        <DiscoverFeedChips />
        <DiscoverFeed />
      </Stack>
    </>
  );
}

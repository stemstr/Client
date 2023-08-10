import { Box, Stack } from "@mantine/core";
import Head from "next/head";
import DiscoverFeed from "components/DiscoverFeed/DiscoverFeed";
import FeedHeader from "../components/FeedHeader/FeedHeader";
import useFooterHeight from "ndk/hooks/useFooterHeight";

export default function Discover() {
  const footerHeight = useFooterHeight();

  return (
    <>
      <Head>
        <title>Stemstr - Discover</title>
      </Head>
      <Stack spacing={0} h={`calc(100vh - ${footerHeight}px)`}>
        <FeedHeader>Stemstr</FeedHeader>
        <Box sx={{ flexGrow: 1 }}>
          <DiscoverFeed />
        </Box>
      </Stack>
    </>
  );
}

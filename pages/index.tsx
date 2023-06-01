import { Box, Stack } from "@mantine/core";
import Head from "next/head";
import HomeFeed from "../components/HomeFeed/HomeFeed";
import HomeFeedHeader from "../components/HomeFeedHeader/HomeFeedHeader";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Stemstr - Discover</title>
      </Head>
      {/* <ColorSchemeToggle /> */}
      <Stack spacing={0}>
        <Box m="auto" pl="md" pr="md" w="100%" sx={{ maxWidth: 568 }}>
          <HomeFeedHeader />
        </Box>
        <HomeFeed />
      </Stack>
    </>
  );
}

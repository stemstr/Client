import { Stack } from "@mantine/core";
import Head from "next/head";
import DiscoverFeed from "components/DiscoverFeed/DiscoverFeed";
import FeedHeader from "../components/FeedHeader/FeedHeader";

export default function Discover() {
  return (
    <>
      <Head>
        <title>Stemstr - Discover</title>
      </Head>
      <Stack spacing={0} h="100vh">
        <FeedHeader>Stemstr</FeedHeader>
        <DiscoverFeed />
      </Stack>
    </>
  );
}

import { Stack } from "@mantine/core";
import Head from "next/head";
import DiscoverFeed from "components/DiscoverFeed/DiscoverFeed";
import FeedHeader from "../components/FeedHeader/FeedHeader";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Stemstr - Discover</title>
      </Head>
      <Stack spacing={0}>
        <FeedHeader>Stemstr</FeedHeader>
        <DiscoverFeed />
      </Stack>
    </>
  );
}

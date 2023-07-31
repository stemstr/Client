import { Stack } from "@mantine/core";
import Head from "next/head";
import DiscoverFeed from "components/DiscoverFeed/DiscoverFeed";
import FeedHeader from "../components/FeedHeader/FeedHeader";
import { useRef } from "react";
import { VariableSizeList } from "react-window";

export default function Discover() {
  const listRef = useRef<VariableSizeList>(null);

  return (
    <>
      <Head>
        <title>Stemstr - Discover</title>
      </Head>
      <Stack spacing={0}>
        <FeedHeader
          onClickTitle={() => listRef.current?.scrollToItem(0, "start")}
        >
          Stemstr
        </FeedHeader>
        <DiscoverFeed listRef={listRef} />
      </Stack>
    </>
  );
}

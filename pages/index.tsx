import { Box, Stack } from "@mantine/core";
import Head from "next/head";
import HomeFeed from "../components/HomeFeed/HomeFeed";
import HomeFeedHeader from "../components/HomeFeedHeader/HomeFeedHeader";
import { useSelector } from "react-redux";
import { AppState } from "store/Store";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Route } from "enums";

export default function HomePage() {
  const authState = useSelector((state: AppState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!authState.type) {
      router.push(Route.Discover);
    }
  }, [authState.type]);

  return (
    <>
      <Head>
        <title>Stemstr - Home</title>
      </Head>
      {/* <ColorSchemeToggle /> */}
      <Stack spacing={0}>
        <Box m="auto" pl="md" pr="md" w="100%" sx={{ maxWidth: 600 }}>
          <HomeFeedHeader />
        </Box>
        <HomeFeed />
      </Stack>
    </>
  );
}

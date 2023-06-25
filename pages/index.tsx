import { Stack } from "@mantine/core";
import Head from "next/head";
import HomeFeed from "../components/HomeFeed/HomeFeed";
import { Route } from "enums";
import FeedHeader from "../components/FeedHeader/FeedHeader";
import useAuth from "hooks/useAuth";

export default function HomePage() {
  const { guardAuth, isAuthenticated } = useAuth();
  guardAuth(Route.Discover);

  return isAuthenticated ? (
    <>
      <Head>
        <title>Stemstr - Home</title>
      </Head>
      {/* <ColorSchemeToggle /> */}
      <Stack spacing={0}>
        <FeedHeader>Stemstr</FeedHeader>
        <HomeFeed />
      </Stack>
    </>
  ) : null;
}

import { Stack } from "@mantine/core";
import Head from "next/head";
import HomeFeed from "../components/HomeFeed/HomeFeed";
import HomeFeedHeader from "../components/HomeFeedHeader/HomeFeedHeader";
import { useSelector } from "react-redux";
import { AppState } from "store/Store";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Route } from "enums";
import { MaxWidthContainer } from "../components/Feed";

export default function HomePage() {
  const authState = useSelector((state: AppState) => state.auth);
  const router = useRouter();
  const willRedirect = !authState.type;

  useEffect(() => {
    if (willRedirect) {
      router.push(Route.Discover);
    }
  }, [willRedirect]);

  return willRedirect ? null : (
    <>
      <Head>
        <title>Stemstr - Home</title>
      </Head>
      {/* <ColorSchemeToggle /> */}
      <Stack spacing={0}>
        <MaxWidthContainer>
          <HomeFeedHeader />
        </MaxWidthContainer>
        <HomeFeed />
      </Stack>
    </>
  );
}

import { Box, Stack } from "@mantine/core";
import Head from "next/head";
import FeedHeader from "../components/FeedHeader/FeedHeader";
import useAuth from "hooks/useAuth";
import NotificationsFeed from "components/NotificationsFeed/NotificationsFeed";
import useFooterHeight from "ndk/hooks/useFooterHeight";

export default function Notifications() {
  const { guardAuth } = useAuth();
  guardAuth();
  const footerHeight = useFooterHeight();

  return (
    <>
      <Head>
        <title>Stemstr - Notifications</title>
      </Head>
      <Stack spacing={0} h={`calc(100vh - ${footerHeight}px)`}>
        <FeedHeader>Notifications</FeedHeader>
        <Box sx={{ flexGrow: 1 }}>
          <NotificationsFeed />
        </Box>
      </Stack>
    </>
  );
}

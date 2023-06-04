import { Box, Stack } from "@mantine/core";
import { useNotifications } from "ndk/hooks/useNotifications";
import { useSelector } from "react-redux";
import { AppState } from "store/Store";
import NotificationView from "components/NotificationView/NotificationView";
import HomeFeedHeader from "components/HomeFeedHeader/HomeFeedHeader";
import Head from "next/head";

export default function Notifications() {
  const authState = useSelector((state: AppState) => state.auth);
  const notifications = useNotifications({ pubkey: authState.pk as string });
  return (
    <>
      <Head>
        <title>Stemstr - Notifications</title>
      </Head>
      <Stack spacing={0}>
        <Box m="auto" pl="md" pr="md" w="100%" sx={{ maxWidth: 600 }}>
          <HomeFeedHeader />
        </Box>
        {Array.from(notifications.values())
          .sort((a, b) => b.created_at - a.created_at)
          .map((notification) => (
            <NotificationView notification={notification} />
          ))}
      </Stack>
    </>
  );
}

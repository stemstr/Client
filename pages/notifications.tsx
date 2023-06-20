import { Stack } from "@mantine/core";
import { useNotifications } from "ndk/hooks/useNotifications";
import { useSelector } from "react-redux";
import { AppState } from "store/Store";
import NotificationView from "components/NotificationView/NotificationView";
import Head from "next/head";
import FeedHeader from "../components/FeedHeader/FeedHeader";

export default function Notifications() {
  const authState = useSelector((state: AppState) => state.auth);
  const notifications = useNotifications({ pubkey: authState.pk as string });
  return (
    <>
      <Head>
        <title>Stemstr - Notifications</title>
      </Head>
      <Stack spacing="md">
        <FeedHeader>Notifications</FeedHeader>
        {Array.from(notifications.values())
          .sort((a, b) => b.created_at - a.created_at)
          .map((notification, index) => (
            <NotificationView key={index} notification={notification} />
          ))}
      </Stack>
    </>
  );
}

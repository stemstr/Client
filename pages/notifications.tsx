import { Stack } from "@mantine/core";
// import { useNotifications } from "ndk/hooks/useNotifications";
import NotificationView from "components/NotificationView/NotificationView";
import Head from "next/head";
import FeedHeader from "../components/FeedHeader/FeedHeader";
import useAuth from "hooks/useAuth";
import { useNotifications } from "ndk/NostrNotificationsProvider";

export default function Notifications() {
  const { guardAuth } = useAuth();
  guardAuth();

  const { notifications } = useNotifications();

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

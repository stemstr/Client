import { Stack } from "@mantine/core";
import NotificationView from "components/NotificationView/NotificationView";
import Head from "next/head";
import FeedHeader from "../components/FeedHeader/FeedHeader";
import useAuth from "hooks/useAuth";
import { useNotifications } from "ndk/NostrNotificationsProvider";
import { useEffect } from "react";

export default function Notifications() {
  const { guardAuth } = useAuth();
  guardAuth();

  const { notifications, markAllAsRead } = useNotifications();

  useEffect(() => {
    markAllAsRead();
  }, []);

  return (
    <>
      <Head>
        <title>Stemstr - Notifications</title>
      </Head>
      <Stack spacing="md">
        <FeedHeader>Notifications</FeedHeader>
        {Array.from(notifications.values())
          .sort((a, b) => b.created_at - a.created_at)
          .slice(0, 30)
          .map((notification, index) => (
            <NotificationView key={index} notification={notification} />
          ))}
      </Stack>
    </>
  );
}

import { Box } from "@mantine/core";
import { Notification } from "ndk/hooks/useNotifications";

export default function NotificationView({
  notification,
}: {
  notification: Notification;
}) {
  return (
    <Box
      key={JSON.stringify([notification.kind, notification.referencedEventId])}
    >
      {notification.kind}, {notification.referencedEventId}:{" "}
      {notification.events.length}
    </Box>
  );
}

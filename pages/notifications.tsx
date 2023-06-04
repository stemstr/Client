import { Stack } from "@mantine/core";
import { useNotifications } from "ndk/hooks/useNotifications";
import { useSelector } from "react-redux";
import { AppState } from "store/Store";
import NotificationView from "components/Notification/Notification";

export default function Notifications() {
  const authState = useSelector((state: AppState) => state.auth);
  const notifications = useNotifications({ pubkey: authState.pk as string });
  return (
    <Stack>
      {Array.from(notifications.values())
        .sort((a, b) => a.created_at - b.created_at)
        .map((notification) => (
          <NotificationView notification={notification} />
        ))}
    </Stack>
  );
}

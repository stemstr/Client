import { Box, Center, Text } from "@mantine/core";
import { FeedNote } from "components/Note/Note";
import useStyles from "components/NotificationView/NotificationView.styles";
import { HeartIcon, RepostIcon, ZapIcon } from "icons/StemstrIcon";
import { Notification } from "ndk/hooks/useNotifications";
import { Kind } from "nostr-tools";

type NotificationViewProps = {
  notification: Notification;
};

export default function NotificationView(props: NotificationViewProps) {
  const { classes } = useStyles();
  const { notification } = props;
  let NotificationView = null;
  switch (notification.kind) {
    case Kind.Reaction:
      NotificationView = <ReactionNotificationView {...props} />;
      break;
    case Kind.Text:
    case 1808 as Kind:
      return (
        <Box
          key={JSON.stringify([
            notification.kind,
            notification.referencedEventId,
          ])}
          className={classes.container}
        >
          <FeedNote event={notification.events[0]} />
        </Box>
      );
    case Kind.Zap:
      NotificationView = <ZapNotificationView {...props} />;
      break;
    case 6 as Kind:
      NotificationView = <RepostNotificationView {...props} />;
      break;
    default:
      NotificationView = <DefaultNotificationView {...props} />;
  }
  return (
    <Box
      key={JSON.stringify([notification.kind, notification.referencedEventId])}
      className={classes.container}
    >
      <Box className={classes.notification}>{NotificationView}</Box>
    </Box>
  );
}

function ReactionNotificationView(props: NotificationViewProps) {
  const { classes } = useStyles();
  return (
    <>
      <Center className={`${classes.kindIcon} ${classes.kindIconReaction}`}>
        <HeartIcon width={20} height={20} />
      </Center>
    </>
  );
}

function ZapNotificationView(props: NotificationViewProps) {
  const { classes } = useStyles();
  return (
    <>
      <Center className={`${classes.kindIcon} ${classes.kindIconZap}`}>
        <ZapIcon width={20} height={20} />
      </Center>
    </>
  );
}

function RepostNotificationView(props: NotificationViewProps) {
  const { classes } = useStyles();
  return (
    <>
      <Center className={`${classes.kindIcon} ${classes.kindIconRepost}`}>
        <RepostIcon width={20} height={20} />
      </Center>
    </>
  );
}

function DefaultNotificationView(props: NotificationViewProps) {
  return <Text>Unknown notification type</Text>;
}

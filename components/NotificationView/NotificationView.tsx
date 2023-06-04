import { Box, Center, Group, Stack, Text } from "@mantine/core";
import { NDKUser } from "@nostr-dev-kit/ndk";
import { FeedNote } from "components/Note/Note";
import useStyles from "components/NotificationView/NotificationView.styles";
import { HeartIcon, RepostIcon, ZapIcon } from "icons/StemstrIcon";
import { Notification } from "ndk/hooks/useNotifications";
import { Kind } from "nostr-tools";

type NotificationViewProps = {
  notification: Notification;
};

type NotificationProps = NotificationViewProps & {
  profiles: NDKUser[];
};

export default function NotificationView(props: NotificationViewProps) {
  const { classes } = useStyles();
  const { notification } = props;
  const profiles: NDKUser[] = [];

  let NotificationView = null;
  switch (notification.kind) {
    case Kind.Reaction:
      NotificationView = (
        <ReactionNotificationView {...props} profiles={profiles} />
      );
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
      NotificationView = <ZapNotificationView {...props} profiles={profiles} />;
      break;
    case 6 as Kind:
      NotificationView = (
        <RepostNotificationView {...props} profiles={profiles} />
      );
      break;
    default:
      NotificationView = (
        <DefaultNotificationView {...props} profiles={profiles} />
      );
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

function ReactionNotificationView(props: NotificationProps) {
  const { classes } = useStyles();
  return (
    <Group className={classes.notificationHeader}>
      <Center className={`${classes.kindIcon} ${classes.kindIconReaction}`}>
        <HeartIcon width={20} height={20} />
      </Center>
      <NotificationHeader {...props} />
    </Group>
  );
}

function ZapNotificationView(props: NotificationProps) {
  const { classes } = useStyles();
  return (
    <Group className={classes.notificationHeader}>
      <Center className={`${classes.kindIcon} ${classes.kindIconZap}`}>
        <ZapIcon width={20} height={20} />
      </Center>
      <NotificationHeader {...props} />
    </Group>
  );
}

function RepostNotificationView(props: NotificationProps) {
  const { classes } = useStyles();
  return (
    <Group className={classes.notificationHeader}>
      <Center className={`${classes.kindIcon} ${classes.kindIconRepost}`}>
        <RepostIcon width={20} height={20} />
      </Center>
      <NotificationHeader {...props} />
    </Group>
  );
}

function DefaultNotificationView(props: NotificationProps) {
  return <Text>Unknown notification type</Text>;
}

function NotificationHeader(props: NotificationProps) {
  const { classes } = useStyles();
  return (
    <Stack className={classes.notificationHeaderProfiles}>
      <NotificationHeaderProfilePics {...props} />
      <NotificationHeaderProfileNames {...props} />
    </Stack>
  );
}

function NotificationHeaderProfilePics(props: NotificationProps) {
  const { classes } = useStyles();
  const { profiles } = props;
  return <Group className={classes.notificationHeaderProfilePics}></Group>;
}

function NotificationHeaderProfileNames(props: NotificationProps) {
  const { classes } = useStyles();
  const { profiles } = props;
  return <Group className={classes.notificationHeaderProfileNames}></Group>;
}

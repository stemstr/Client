import { Box, Center, Group, Image, Stack, Text } from "@mantine/core";
import { NDKUser } from "@nostr-dev-kit/ndk";
import { FeedNote } from "components/Note/Note";
import useStyles from "components/NotificationView/NotificationView.styles";
import { HeartIcon, RepostIcon, ZapIcon } from "icons/StemstrIcon";
import { Notification } from "ndk/hooks/useNotifications";
import { useProfiles } from "ndk/hooks/useProfiles";
import { Kind } from "nostr-tools";
import { useMemo } from "react";

type NotificationViewProps = {
  notification: Notification;
};

type NotificationProps = NotificationViewProps & {
  users: NDKUser[];
};

export default function NotificationView(props: NotificationViewProps) {
  const { classes } = useStyles();
  const { notification } = props;
  const profileIds = useMemo(
    () => notification.events.map((event) => event.pubkey),
    [notification.events.length]
  );
  const users: NDKUser[] = useProfiles({ hexpubkeys: profileIds });

  let NotificationView = null;
  switch (notification.kind) {
    case Kind.Reaction:
      NotificationView = <ReactionNotificationView {...props} users={users} />;
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
      NotificationView = <ZapNotificationView {...props} users={users} />;
      break;
    case 6 as Kind:
      NotificationView = <RepostNotificationView {...props} users={users} />;
      break;
    default:
      NotificationView = <DefaultNotificationView {...props} users={users} />;
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
  const { users } = props;
  const maxDisplayedUsers = 10;
  return (
    <Group className={classes.notificationHeaderProfilePics} spacing={0}>
      {users.slice(0, maxDisplayedUsers).map((user, index) =>
        user.profile?.image ? (
          <Image
            src={user.profile.image}
            width={28}
            height={28}
            alt=""
            styles={(theme) => ({
              root: {
                marginLeft: index * -7,
              },
              image: {
                borderRadius: "50%",
                border: `2px solid ${theme.colors.dark[8]}`,
              },
            })}
          />
        ) : null
      )}
      {users.length > maxDisplayedUsers && (
        <Center
          w={28}
          h={28}
          bg="gray.6"
          pos="relative"
          sx={(theme) => ({
            marginLeft: maxDisplayedUsers * -7,
            borderRadius: "50%",
            border: `2px solid ${theme.colors.dark[8]}`,
          })}
        >
          <Text fz="xs" c="white">
            {users.length - maxDisplayedUsers}+
          </Text>
        </Center>
      )}
    </Group>
  );
}

function NotificationHeaderProfileNames(props: NotificationProps) {
  const { classes } = useStyles();
  const { users } = props;
  return <Group className={classes.notificationHeaderProfileNames}></Group>;
}

import { Anchor, Avatar, Box, Center, Group, Stack, Text } from "@mantine/core";
import { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";
import { FeedNote } from "components/Note/Note";
import useStyles from "components/NotificationView/NotificationView.styles";
import { Route } from "enums";
import { HeartIcon, ProfileIcon, RepostIcon, ZapIcon } from "icons/StemstrIcon";
import { useNDK } from "ndk/NDKProvider";
import { Notification } from "ndk/hooks/useNotifications";
import { useProfiles } from "ndk/hooks/useProfiles";
import Link from "next/link";
import { Kind } from "nostr-tools";
import { useEffect, useMemo, useState } from "react";

type NotificationViewProps = {
  notification: Notification;
};

type NotificationProps = NotificationViewProps & {
  users: NDKUser[];
  referencedEvent?: NDKEvent;
};

export default function NotificationView(props: NotificationViewProps) {
  const { ndk } = useNDK();
  const { classes } = useStyles();
  const { notification } = props;
  const profileIds = useMemo(
    () => notification.events.map((event) => event.pubkey),
    [notification.events.length]
  );
  const users: NDKUser[] = useProfiles({ hexpubkeys: profileIds });
  const [referencedEvent, setReferencedEvent] = useState<
    NDKEvent | undefined
  >();

  useEffect(() => {
    if (ndk && notification.referencedEventId) {
      ndk
        ?.fetchEvent({ ids: [notification.referencedEventId] })
        .then((event) => {
          setReferencedEvent(event || undefined);
        });
    }
  }, [ndk, notification.referencedEventId, setReferencedEvent]);

  let NotificationView = null;
  switch (notification.kind) {
    case Kind.Reaction:
      NotificationView = (
        <ReactionNotificationView
          {...props}
          users={users}
          referencedEvent={referencedEvent}
        />
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
      <Anchor
        component={Link}
        href={
          notification.referencedEventId
            ? `${Route.Thread}/${notification.referencedEventId}`
            : ``
        }
        sx={{
          "&:hover": {
            textDecoration: "none",
          },
        }}
      >
        <Box className={classes.notification}>{NotificationView}</Box>
      </Anchor>
    </Box>
  );
}

function ReactionNotificationView(props: NotificationProps) {
  const { classes } = useStyles();
  return (
    <>
      <Group className={classes.notificationHeader}>
        <Center className={`${classes.kindIcon} ${classes.kindIconReaction}`}>
          <HeartIcon width={20} height={20} />
        </Center>
        <NotificationHeader {...props} />
      </Group>
      <NotificationBody {...props} />
    </>
  );
}

function ZapNotificationView(props: NotificationProps) {
  const { classes } = useStyles();
  return (
    <>
      <Group className={classes.notificationHeader}>
        <Center className={`${classes.kindIcon} ${classes.kindIconZap}`}>
          <ZapIcon width={20} height={20} />
        </Center>
        <NotificationHeader {...props} />
      </Group>
      <NotificationBody {...props} />
    </>
  );
}

function RepostNotificationView(props: NotificationProps) {
  const { classes } = useStyles();
  return (
    <>
      <Group align="center" className={classes.notificationHeader}>
        <Center className={`${classes.kindIcon} ${classes.kindIconRepost}`}>
          <RepostIcon width={20} height={20} />
        </Center>
        <NotificationHeader {...props} />
      </Group>
      <NotificationBody {...props} />
    </>
  );
}

function DefaultNotificationView(props: NotificationProps) {
  return <Text>Unknown notification type</Text>;
}

function NotificationHeader(props: NotificationProps) {
  const { classes } = useStyles();
  return (
    <Stack spacing={6} className={classes.notificationHeaderProfiles}>
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
      {users.slice(0, maxDisplayedUsers).map((user, index) => (
        <Avatar
          src={user.profile?.image}
          alt={user.profile?.name}
          size={28}
          styles={(theme) => ({
            root: {
              marginLeft: index > 0 ? -7 : undefined,
            },
            image: {
              borderRadius: "50%",
              border: `2px solid ${theme.colors.dark[8]}`,
            },
          })}
        >
          <ProfileIcon />
        </Avatar>
      ))}
      {users.length > maxDisplayedUsers && (
        <Center
          w={28}
          h={28}
          bg="gray.6"
          pos="relative"
          sx={(theme) => ({
            marginLeft: -7,
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
  const [displayedUsers, setDisplayedUsers] = useState<JSX.Element[]>([]);

  const renderedUsers = useMemo(() => {
    if (users.length === 0) return <></>;
    if (users.length === 1) return <>{displayedUsers[0]}</>;
    if (users.length === 2)
      return (
        <>
          {displayedUsers[0]} and {displayedUsers[1]}
        </>
      );
    if (users.length === 3)
      return (
        <>
          {displayedUsers[0]}, {displayedUsers[1]}, and {displayedUsers[2]}
        </>
      );
    if (users.length > 3)
      return (
        <>
          {displayedUsers[0]}, {displayedUsers[1]}, {displayedUsers[2]} and{" "}
          {users.length - 3} more
        </>
      );
    return <></>;
  }, [displayedUsers, users.length]);

  const output = useMemo(() => {
    switch (props.notification.kind) {
      case 6 as Kind:
        return <>{renderedUsers} reposted your note</>;
      case Kind.Reaction:
        return <>{renderedUsers} reacted to your post</>;
      case Kind.Zap:
        return <>{renderedUsers} zapped you</>;
      default:
        return null;
    }
  }, [renderedUsers]);

  useEffect(() => {
    const newDisplayedUsers = users.slice(0, 3).map((user) => (
      <Anchor component={Link} c="purple.5" href={`${Route.User}/${user.npub}`}>
        @{user.profile?.name || `${user.hexpubkey().slice(0, 5)}...`}
      </Anchor>
    ));
    setDisplayedUsers(newDisplayedUsers);
  }, [users, users.length, setDisplayedUsers]);

  return (
    <Text fz="xs" c="gray.1" className={classes.notificationHeaderProfileNames}>
      {output}
    </Text>
  );
}

function NotificationBody(props: NotificationProps) {
  const { classes } = useStyles();

  return (
    <Box c="white" mt="md">
      <Text>{props.referencedEvent?.content}</Text>
    </Box>
  );
}

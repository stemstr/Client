import { Anchor, Avatar, Box, Center, Group, Stack, Text } from "@mantine/core";
import { NDKEvent, NDKTag, NDKUser, NostrEvent } from "@nostr-dev-kit/ndk";
import { FeedNote } from "components/Note/Note";
import useStyles from "components/NotificationView/NotificationView.styles";
import { Route } from "enums";
import { HeartIcon, ProfileIcon, RepostIcon, ZapIcon } from "icons/StemstrIcon";
import { EventProvider } from "ndk/NDKEventProvider";
import { useNDK } from "ndk/NDKProvider";
import { Notification } from "ndk/NostrNotificationsProvider";
import useProfilePicSrc from "ndk/hooks/useProfilePicSrc";
import { useUsers } from "ndk/hooks/useUsers";
import Link from "next/link";
import { useRouter } from "next/router";
import { Kind } from "nostr-tools";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "store/Auth";

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
  const router = useRouter();
  const profileIds = useMemo(() => {
    // Get profile ids for zap events
    if (notification.kind === Kind.Zap) {
      const newProfileIds: string[] = [];
      notification.events.forEach((event: NDKEvent) => {
        // Parse zap request event from description tag
        const descriptionTag = event.tags.find(
          (tag: NDKTag) => tag[0] === "description"
        );
        if (!descriptionTag) return;
        try {
          const description = JSON.parse(descriptionTag[1]) as NostrEvent;
          if (description.pubkey) newProfileIds.push(description.pubkey);
        } catch (err) {}
      });
      return newProfileIds;
    }
    // Get profile ids for all other events
    return notification.events.map((event: NDKEvent) => event.pubkey);
  }, [notification.events, notification.events.length]);
  const users: NDKUser[] = useUsers(profileIds);
  const [referencedEvent, setReferencedEvent] = useState<
    NDKEvent | undefined
  >();

  useEffect(() => {
    if (ndk && notification.referencedEventId) {
      ndk?.fetchEvent(notification.referencedEventId).then((event) => {
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
          {/* <FeedNote event={notification.events[0]} /> */}
          <EventProvider event={notification.events[0]}>
            <FeedNote key={notification.events[0].id} />
          </EventProvider>
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

  const handleClick = () => {
    if (notification.referencedEventId) {
      router.push({
        pathname: Route.Thread,
        query: { noteId: notification.referencedEventId },
      });
    }
  };

  return (
    <Box
      key={JSON.stringify([notification.kind, notification.referencedEventId])}
      className={classes.container}
      onClick={handleClick}
    >
      {/* <Anchor
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
      > */}
      <Box className={classes.notification}>{NotificationView}</Box>
      {/* </Anchor> */}
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

function NotificationHeaderProfilePic({
  user,
  index,
}: {
  user: NDKUser;
  index: number;
}) {
  const src = useProfilePicSrc(user);

  return (
    <Avatar
      key={index}
      src={src}
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
  );
}

function NotificationHeaderProfilePics(props: NotificationProps) {
  const { classes } = useStyles();
  const { users } = props;
  const maxDisplayedUsers = 10;

  return (
    <Group className={classes.notificationHeaderProfilePics} spacing={0}>
      {users.slice(0, maxDisplayedUsers).map((user, index) => (
        <NotificationHeaderProfilePic user={user} index={index} key={index} />
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
  const authSate = useSelector(selectAuthState);
  const [displayedUsers, setDisplayedUsers] = useState<JSX.Element[]>([]);
  const referencedEventIsUsers = useMemo(
    () => props.referencedEvent?.pubkey === authSate.pk,
    [props.referencedEvent?.pubkey, authSate.pk]
  );

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
        return (
          <>
            {renderedUsers} reposted{" "}
            {referencedEventIsUsers ? "your post" : "a post you were tagged in"}
          </>
        );
      case Kind.Reaction:
        return (
          <>
            {renderedUsers} reacted to{" "}
            {referencedEventIsUsers ? "your post" : "a post you were tagged in"}
          </>
        );
      case Kind.Zap:
        return <>{renderedUsers} zapped you</>;
      default:
        return null;
    }
  }, [props.notification.kind, renderedUsers, referencedEventIsUsers]);

  useEffect(() => {
    const newDisplayedUsers = users.slice(0, 3).map((user) => (
      <Anchor
        key={user.hexpubkey()}
        component={Link}
        c="purple.5"
        href={`${Route.User}/${user.npub}`}
      >
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
  return (
    <Box c="white" mt="md" sx={{ overflowWrap: "anywhere" }}>
      <Text>{props.referencedEvent?.content}</Text>
    </Box>
  );
}

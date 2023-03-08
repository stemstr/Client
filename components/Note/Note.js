import {
  Anchor,
  Avatar,
  Box,
  Center,
  Chip,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import useStyles from "./Note.styles";
import NoteAction from "../NoteAction/NoteAction";
import SoundPlayer from "../SoundPlayer/SoundPlayer";
import { dateToUnix, useProfile } from "nostr-react";
import { getEventHash, Kind, nip19, signEvent } from "nostr-tools";
import { useEffect, useMemo, useState } from "react";
import {
  DownloadIcon,
  MoreIcon,
  CommentIcon,
  ZapIcon,
  ShakaIcon,
  RepostIcon,
  VerifiedIcon,
} from "../../icons/StemstrIcon";
import { cacheProfile, getCachedProfile } from "../../cache/cache";
import Link from "next/link";
import { useSelector } from "react-redux";
import useNostr from "../../nostr/hooks/useNostr";

export default function Note(props) {
  const { event, reactionEvents } = props;
  const { classes } = useStyles();
  const { publish } = useNostr();
  const auth = useSelector((state) => state.auth);
  const cachedProfile = getCachedProfile(nip19.npubEncode(event.pubkey));
  const [userData, setUserData] = useState(cachedProfile);
  const [profileFetched, setProfileFetched] = useState(false);
  const { data } = useProfile({
    pubkey: event.pubkey,
    enabled: !!event.pubkey && !userData,
  });
  const reactions = useMemo(
    () =>
      reactionEvents.filter((ev) =>
        ev.tags.reduce(
          (carry, tag) => carry || (tag[0] == "e" && tag[1] == event.id),
          false
        )
      ),
    [reactionEvents]
  );

  const handleClickShaka = () => {
    let created_at = Math.floor(Date.now() / 1000);
    let tags = [
      ["p", event.pubkey],
      ["e", event.id],
    ];
    let reactionEvent = {
      kind: Kind.Reaction,
      pubkey: auth.user.pk,
      created_at: created_at,
      tags: tags,
      content: "🤙",
    };
    reactionEvent.id = getEventHash(reactionEvent);
    reactionEvent.sig = signEvent(reactionEvent, auth.sk);
    publish(reactionEvent, [process.env.NEXT_PUBLIC_STEMSTR_RELAY]);
    console.log(reactionEvent);
  };

  useEffect(() => {
    console.log(reactionEvents);
  }, [reactionEvents]);

  useEffect(() => {
    if (!profileFetched && data) {
      setProfileFetched(true);
      setUserData(data);
      cacheProfile(data.npub, data);
    }
  }, [data, setUserData]);

  return (
    <Box className={classes.box}>
      <Stack>
        <Group position="apart">
          <Group spacing={6}>
            <Anchor component={Link} href={`/user/${event.pubkey}`}>
              <Avatar
                src={userData?.picture}
                alt={userData?.name}
                size={42}
                radius="50%"
              />
            </Anchor>
            <Text size="lg" color="white">
              {userData?.display_name
                ? userData.display_name
                : `@${event.pubkey.substring(0, 5)}...`}
            </Text>
            <VerifiedIcon width={14} height={14} />
            <Text size="xs" color="rgba(255, 255, 255, 0.74)">
              {userData?.name ? `@${userData.name}` : ""}
            </Text>
            <Text size="sm" color="rgba(255, 255, 255, 0.38)">
              · {Math.floor((dateToUnix(new Date()) - event.created_at) / 60)}m
            </Text>
          </Group>
          <Group position="right">
            <Center
              sx={(theme) => ({
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "1px solid",
                borderColor: theme.colors.gray[2],
                color: theme.white,
              })}
            >
              <DownloadIcon width={12} height={12} />
            </Center>
            <Center
              sx={(theme) => ({
                width: 28,
                height: 28,
                color: theme.colors.gray[2],
              })}
            >
              <MoreIcon width={24} height={24} />
            </Center>
          </Group>
        </Group>
        <SoundPlayer event={event} />
        <Text c="white" sx={{ overflowWrap: "anywhere" }}>
          {event.content}
        </Text>
        <Group position="left">
          {event?.tags
            ?.filter((tag) => tag[0] == "t")
            .map((tag, index) => (
              <Chip radius="md" key={index}>
                #{tag[1]}
              </Chip>
            ))}
        </Group>
        <Group position="apart">
          <NoteAction sx={{ color: "white" }}>
            <CommentIcon width={18} height={18} /> 12
          </NoteAction>
          <NoteAction>
            <RepostIcon width={18} height={18} /> 4
          </NoteAction>
          <NoteAction>
            <ShakaIcon onClick={handleClickShaka} width={18} height={18} />{" "}
            {reactions?.length}
          </NoteAction>
          <NoteAction>
            <ZapIcon width={18} height={18} /> 4
          </NoteAction>
        </Group>
      </Stack>
    </Box>
  );
}

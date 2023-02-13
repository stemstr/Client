import { Avatar, Box, Group, Stack, Text } from "@mantine/core";
import useStyles from "./Note.styles";
import NoteAction from "../NoteAction/NoteAction";
import { dateToUnix, useProfile } from "nostr-react";
import { useEffect } from "react";

export default function Note(props) {
  const { event } = props;
  const { data: userData } = useProfile({
    pubkey: event.pubkey,
  });
  const { classes } = useStyles();

  return (
    <Box className={classes.box}>
      <Stack>
        <Group position="apart">
          <Group>
            <Avatar
              src={userData?.picture}
              alt={userData?.name}
              size={42}
              radius="50%"
            />
            <Text size="lg" color="white">
              {userData?.display_name
                ? userData.display_name
                : `@${event.pubkey.substring(0, 5)}...`}
            </Text>
            <Text>✅</Text>
            <Text size="xs" color="rgba(255, 255, 255, 0.74)">
              {userData?.name ? `@${userData.name}` : ""}
            </Text>
            <Text size="sm" color="rgba(255, 255, 255, 0.38)">
              {Math.floor((dateToUnix(new Date()) - event.created_at) / 60)}m
            </Text>
          </Group>
          <Group position="right">
            <Text>⬇️</Text>
            <Text>⋮</Text>
          </Group>
        </Group>
        <Box className={classes.player}></Box>
        <Text sx={{ overflowWrap: "anywhere" }}>{event.content}</Text>
        <Group position="left">
          <Text>#hiphop</Text>
          <Text>#soul</Text>
          <Text>#indie</Text>
          <Text>#synthpad</Text>
        </Group>
        <Group position="apart">
          <NoteAction>💬 12</NoteAction>
          <NoteAction>🔁 4</NoteAction>
          <NoteAction>🤙🏻 4</NoteAction>
          <NoteAction>⚡️ 4</NoteAction>
          <NoteAction>✉️</NoteAction>
        </Group>
      </Stack>
    </Box>
  );
}

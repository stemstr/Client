import { Avatar, Box, Center, Group, Stack, Text } from "@mantine/core";
import useStyles from "./Note.styles";
import NoteAction from "../NoteAction/NoteAction";
import { dateToUnix, useProfile } from "nostr-react";
import { useEffect } from "react";
import {
  DownloadIcon,
  MoreIcon,
  CommentIcon,
  ZapIcon,
  ShakaIcon,
  RepostIcon,
  VerifiedIcon,
} from "../../icons/StemstrIcon";

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
          <Group spacing={6}>
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
        <Box className={classes.player}></Box>
        <Text sx={{ overflowWrap: "anywhere" }}>{event.content}</Text>
        <Group position="left">
          <Text>#hiphop</Text>
          <Text>#soul</Text>
          <Text>#indie</Text>
          <Text>#synthpad</Text>
        </Group>
        <Group position="apart">
          <NoteAction sx={{ color: "white" }}>
            <CommentIcon width={18} height={18} /> 12
          </NoteAction>
          <NoteAction>
            <RepostIcon width={18} height={18} /> 4
          </NoteAction>
          <NoteAction>
            <ShakaIcon width={18} height={18} /> 4
          </NoteAction>
          <NoteAction>
            <ZapIcon width={18} height={18} /> 4
          </NoteAction>
        </Group>
      </Stack>
    </Box>
  );
}

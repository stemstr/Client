import { Button, Drawer, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch, useSelector } from "react-redux";
import { closeSheet, openSheet } from "../../store/Sheets";
import SoundFieldGroup from "../FieldGroups/SoundFieldGroup";
import CommentFieldGroup from "../FieldGroups/CommentFieldGroup";
import TagsFieldGroup from "../FieldGroups/TagsFieldGroup";
import ShareAcrossField from "../ShareAcrossField/ShareAcrossField";
import { parseHashtags } from "../TagsField/TagsField";
import { relayInit, getEventHash, signEvent } from "nostr-tools";
import { useRef } from "react";

export default function ShareSheet() {
  const sheetKey = "shareSheet";
  const auth = useSelector((state) => state.auth);
  const relays = useSelector((state) => state.relays);
  const opened = useSelector((state) => state.sheets[sheetKey]);
  const dispatch = useDispatch();
  const form = useForm({
    initialValues: {
      file: null,
      comment: "",
      tags: "",
      shareAcross: true,
    },
    validate: {},
  });

  const handleSubmit = async (values) => {
    let tags = parseHashtags(values.tags).map((hashtag) => ["t", hashtag]);
    let event = {
      kind: 1,
      pubkey: auth.user.pk,
      created_at: Math.floor(Date.now() / 1000),
      tags,
      content: values.comment + " " + values.file.name,
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, auth.sk);

    console.log(values);
    console.log(event);

    const relay = relayInit(relays.stemstrRelay);

    relay.on("connect", () => {
      console.log(`connected to ${relay.url}`);
      let pub = relay.publish(event);
      pub.on("ok", () => {
        console.log(`${relay.url} has accepted our event`);
        dispatch(closeSheet("shareSheet"));
      });
      pub.on("failed", (reason) => {
        console.log(`failed to publish to ${relay.url}: ${reason}`);
      });
    });
    relay.on("error", () => {
      console.log(`failed to connect to ${relay.url}`);
    });

    await relay.connect();
  };

  const toggleSheet = () => {
    if (opened) {
      dispatch(closeSheet(sheetKey));
    } else {
      dispatch(openSheet(sheetKey));
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={() => toggleSheet()}
      position="bottom"
      title="Share"
      padding="md"
      size="full"
      styles={(theme) => ({
        header: {
          paddingTop: 8,
          color: theme.white,
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 40,
        },
        closeButton: {
          color: theme.white,
          svg: {
            width: 24,
            height: 24,
          },
        },
        drawer: {
          backgroundColor: theme.colors.dark[8],
          paddingTop: 24,
          maxWidth: 600,
          margin: "auto",
        },
      })}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing={28}>
          <SoundFieldGroup {...form.getInputProps("file")} />
          <CommentFieldGroup {...form.getInputProps("comment")} />
          <TagsFieldGroup {...form.getInputProps("tags")} />
          <ShareAcrossField {...form.getInputProps("shareAcross")} />
          <Button type="submit">Share</Button>
        </Stack>
      </form>
    </Drawer>
  );
}

import { Box, Button, Drawer, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch, useSelector } from "react-redux";
import { closeSheet, openSheet } from "../../store/Sheets";
import SoundFieldGroup from "../FieldGroups/SoundFieldGroup";
import CommentFieldGroup from "../FieldGroups/CommentFieldGroup";
import TagsFieldGroup from "../FieldGroups/TagsFieldGroup";
import ShareAcrossField from "../ShareAcrossField/ShareAcrossField";
import { parseHashtags } from "../Fields/TagsField/TagsField";
import { useState } from "react";
import { acceptedMimeTypes } from "../../utils/media";
import { parseEventTags } from "../../ndk/utils";
import { useNDK } from "ndk/NDKProvider";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useProfile } from "ndk/hooks/useProfile";

export default function PostSheet() {
  const { ndk, stemstrRelaySet } = useNDK();
  const sheetKey = "postSheet";
  const auth = useSelector((state) => state.auth);
  const relays = useSelector((state) => state.relays);
  const sheetState = useSelector((state) => state.sheets[sheetKey]);
  const dispatch = useDispatch();
  const { data: replyingTo } = useProfile({
    pubkey: sheetState.replyingTo?.pubkey,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const form = useForm({
    initialValues: {
      file: null,
      uploadResponse: {
        streamUrl: null,
        downloadUrl: null,
      },
      comment: "",
      tags: "",
      shareAcross: true,
    },
    validate: {},
  });

  const handleSubmit = async (values) => {
    let hashtags = parseHashtags(values.tags);
    let created_at = Math.floor(Date.now() / 1000);
    let tags = [
      ["client", "stemstr.app"],
      ["stemstr_version", "1.0"],
    ];
    hashtags.forEach((hashtag) => {
      tags.push(["t", hashtag]);
    });
    if (sheetState.replyingTo) {
      const { rootId, replyingToId } = parseEventTags(sheetState.replyingTo);
      if (rootId) {
        tags.push(["e", rootId, "", "root"]);
        tags.push(["e", sheetState.replyingTo.id, "", "reply"]);
      } else {
        tags.push(["e", sheetState.replyingTo.id, "", "root"]);
      }
      const pTagPKs = [sheetState.replyingTo.pubkey];
      sheetState.replyingTo.tags.forEach((t) => {
        if (t[0] === "p") {
          pTagPKs.push(t[1]);
        }
      });
      Array.from(new Set(pTagPKs)).forEach((pk) => {
        tags.push(["p", pk]);
      });
    }

    if (values.uploadResponse.streamUrl && values.uploadResponse.downloadUrl) {
      tags.push(["download_url", values.uploadResponse.downloadUrl]);
      tags.push(["stream_url", values.uploadResponse.streamUrl]);
      const event = new NDKEvent(ndk);
      event.kind = 1808;
      event.created_at = created_at;
      event.tags = tags;
      event.content = values.comment;
      event.publish(stemstrRelaySet).then(() => {
        form.reset();
        dispatch(closeSheet(sheetKey));
      });
    } else {
      const event = new NDKEvent(ndk);
      event.kind = 1;
      event.created_at = created_at;
      event.tags = tags;
      event.content = values.comment;
      event.publish(stemstrRelaySet).then(() => {
        form.reset();
        dispatch(closeSheet(sheetKey));
      });
    }
  };

  const toggleSheet = () => {
    if (sheetState.isOpen) {
      dispatch(closeSheet(sheetKey));
    } else {
      dispatch(openSheet({ sheetKey }));
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (acceptedMimeTypes.includes(file.type)) {
      form.setFieldValue("file", file);
    }

    setIsDragging(false);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    const item = e.dataTransfer.items[0];

    if (item && item.kind === "file" && acceptedMimeTypes.includes(item.type)) {
      setIsDragging(true);
      form.setFieldValue("file", null);
    } else {
      setIsDragging(false);
    }
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    if (e.relatedTarget === null) {
      setIsDragging(false);
    }
  };

  const handleClose = () => {
    toggleSheet();
    form.reset();
  };

  let title = isDragging ? "Drop to proccess sound" : "Share";
  if (sheetState.replyingTo) {
    title = `Replying to @${replyingTo?.name}`;
  }
  if (!sheetState.isOpen) title = "";

  return (
    <Drawer
      opened={sheetState.isOpen}
      onClose={handleClose}
      position="bottom"
      title={title}
      size="80%"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      withCloseButton={false}
      styles={(theme) => ({
        overlay: {
          backgroundColor: "rgba(44, 44, 44, 0.2)!important",
          backdropFilter: "blur(12px)",
          opacity: "1!important",
        },
        header: {
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing.lg,
          backgroundColor: theme.colors.dark[7],
          color: theme.white,
          fontSize: 24,
          fontWeight: 700,
          marginBottom: theme.spacing.md,
        },
        title: {
          textAlign: "center",
          width: "100%",
          margin: 0,
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
          paddingTop: "0!important",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxWidth: 600,
          margin: "auto",
          overflowY: "scroll",
        },
      })}
    >
      <Box pl="md" pr="md" pb="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing={28}>
            <SoundFieldGroup
              form={form}
              isDragging={isDragging}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              {...form.getInputProps("file")}
            />
            <CommentFieldGroup
              data-autofocus
              {...form.getInputProps("comment")}
            />
            <TagsFieldGroup {...form.getInputProps("tags")} />
            {/* <ShareAcrossField {...form.getInputProps("shareAcross")} /> */}
            <Button disabled={isUploading} type="submit">
              Share
            </Button>
          </Stack>
        </form>
      </Box>
    </Drawer>
  );
}

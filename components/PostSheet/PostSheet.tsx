import { Box, Button, Drawer, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch, useSelector } from "react-redux";
import { PostSheetState, closeSheet, openSheet } from "../../store/Sheets";
import SoundFieldGroup from "../FieldGroups/SoundFieldGroup";
import CommentFieldGroup from "../FieldGroups/CommentFieldGroup";
import TagsFieldGroup from "../FieldGroups/TagsFieldGroup";
import ShareAcrossField from "../ShareAcrossField/ShareAcrossField";
import { parseHashtags } from "../Fields/TagsField/TagsField";
import { DragEventHandler, useState } from "react";
import { acceptedMimeTypes } from "../../utils/media";
import { getNormalizedName, parseEventTags } from "../../ndk/utils";
import { useNDK } from "ndk/NDKProvider";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useUser } from "ndk/hooks/useUser";
import { AppState } from "store/Store";
import { Kind } from "nostr-tools";

type PostSheetFormValues = {
  file: File | null;
  uploadResponse: {
    streamUrl: string | null;
    downloadUrl: string | null;
    waveform: number[] | null;
  };
  comment: string;
  tags: string;
  shareAcross: boolean;
};

export default function PostSheet() {
  const { ndk, stemstrRelaySet } = useNDK();
  const sheetKey = "postSheet";
  const { isOpen, replyingTo } = useSelector<AppState, PostSheetState>(
    (state) => state.sheets.postSheet
  );
  const user = useUser(replyingTo?.pubkey);
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const form = useForm<PostSheetFormValues>({
    initialValues: {
      file: null,
      uploadResponse: {
        streamUrl: null,
        downloadUrl: null,
        waveform: null,
      },
      comment: "",
      tags: "",
      shareAcross: true,
    },
    validate: {},
  });

  const handleSubmit = async (values: PostSheetFormValues) => {
    const created_at = Math.floor(Date.now() / 1000);
    let kind: number = Kind.Text;

    const tags = [
      ["client", "stemstr.app"],
      ["stemstr_version", "1.0"],
    ];

    if (
      values.uploadResponse.streamUrl &&
      values.uploadResponse.downloadUrl &&
      values.uploadResponse.waveform
    ) {
      kind = 1808;
      tags.push([
        "download_url",
        values.uploadResponse.downloadUrl,
        "audio/wav",
      ]);
      tags.push([
        "stream_url",
        values.uploadResponse.streamUrl,
        "application/vnd.apple.mpegurl",
      ]);
      tags.push(["waveform", JSON.stringify(values.uploadResponse.waveform)]);
    }

    const hashtags = parseHashtags(values.tags);
    hashtags.forEach((hashtag) => {
      tags.push(["t", hashtag]);
    });

    if (replyingTo?.id) {
      const { root } = parseEventTags(new NDKEvent(ndk, replyingTo));
      if (root) {
        tags.push(root);
        tags.push(["e", replyingTo.id, "", "reply"]);
      } else {
        tags.push(["e", replyingTo.id, "", "root"]);
      }
      const pTagPKs = [replyingTo.pubkey];
      replyingTo.tags.forEach((t) => {
        if (t[0] === "p") {
          pTagPKs.push(t[1]);
        }
      });
      Array.from(new Set(pTagPKs)).forEach((pk) => {
        tags.push(["p", pk]);
      });
    }

    const event = new NDKEvent(ndk);
    event.kind = kind;
    event.created_at = created_at;
    event.tags = tags;
    event.content = values.comment;
    event.publish(stemstrRelaySet).then(() => {
      form.reset();
      dispatch(closeSheet(sheetKey));
    });
  };

  const toggleSheet = () => {
    if (isOpen) {
      dispatch(closeSheet(sheetKey));
    } else {
      dispatch(openSheet({ sheetKey }));
    }
  };

  const onDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];

    if (file && acceptedMimeTypes.includes(file.type)) {
      form.setFieldValue("file", file);
    }

    setIsDragging(false);
  };

  const onDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    const item = event.dataTransfer?.items[0];

    if (item && item.kind === "file" && acceptedMimeTypes.includes(item.type)) {
      setIsDragging(true);
      form.setFieldValue("file", null);
    } else {
      setIsDragging(false);
    }
  };

  const onDragLeave: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (event.relatedTarget === null) {
      setIsDragging(false);
    }
  };

  const handleClose = () => {
    toggleSheet();
    form.reset();
  };

  let title = isDragging ? "Drop to proccess sound" : "Share";
  if (replyingTo) {
    title = `Replying to @${getNormalizedName(replyingTo.pubkey, user)}`;
  }
  if (!isOpen) title = "";

  return (
    <Drawer
      opened={isOpen}
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
          backgroundColor: theme.colors.dark[8],
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
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
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
              {replyingTo ? "Reply" : "Share"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Drawer>
  );
}

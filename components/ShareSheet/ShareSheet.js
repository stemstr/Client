import { Button, Drawer, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch, useSelector } from "react-redux";
import { closeSheet, openSheet } from "../../store/Sheets";
import SoundFieldGroup from "../FieldGroups/SoundFieldGroup";
import CommentFieldGroup from "../FieldGroups/CommentFieldGroup";
import TagsFieldGroup from "../FieldGroups/TagsFieldGroup";
import ShareAcrossField from "../ShareAcrossField/ShareAcrossField";
import { parseHashtags } from "../TagsField/TagsField";
import { getEventHash, signEvent } from "nostr-tools";
import axios from "axios";
import useNostr from "../../nostr/hooks/useNostr";

export default function ShareSheet() {
  const { publish } = useNostr();
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
    let tags = parseHashtags(values.tags);
    let sum = await calculateHash(values.file);

    axios
      .post(
        `${process.env.NEXT_PUBLIC_STEMSTR_API}/upload/quote`,
        {
          pk: auth.user.pk,
          size: values.file.size,
          sum: sum,
          desc: values.comment,
          tags: tags,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        let event = {
          kind: response.data.event.kind,
          pubkey: response.data.event.pubkey,
          created_at: response.data.event.created_at,
          tags: response.data.event.tags,
          content: response.data.event.content,
        };
        event.id = getEventHash(event);
        event.sig = signEvent(event, auth.sk);

        const formData = new FormData();
        formData.append("pk", response.data.event.pubkey);
        formData.append("size", values.file.size);
        formData.append("sum", sum);
        formData.append("event", window.btoa(JSON.stringify(event)));
        formData.append("fileName", values.file.name);
        formData.append("file", values.file);

        axios
          .post(`${process.env.NEXT_PUBLIC_STEMSTR_API}/upload`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            dispatch(closeSheet("shareSheet"));
          })
          .catch((error) => {
            // TODO: handle error
          });
      })
      .catch((error) => {
        // TODO: handle error
      });
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

async function calculateHash(file) {
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    await file.arrayBuffer()
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

import {
  generatePrivateKey,
  getEventHash,
  getPublicKey,
  Kind,
  signEvent,
} from "nostr-tools";
import Head from "next/head";
import { useEffect, useState } from "react";
import SignupComplete from "../components/SignupComplete/SignupComplete";
import SignupForm from "../components/SignupForm/SignupForm";
import { Box } from "@mantine/core";
import { useNDK } from "../ndk/NDKProvider";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState, setSK } from "../store/Auth";

export default function Signup() {
  const { ndk, canPublishEvents } = useNDK();
  const [sk, setSk] = useState(null);
  const [metadataEvent, setMetadataEvent] = useState(null);
  const dispatch = useDispatch();
  const authState = useSelector(selectAuthState);

  const handleSubmit = (values) => {
    if (values.name.length > 1) {
      values.name = values.name.slice(1);
    } else {
      values.name = "";
    }
    let created_at = Math.floor(Date.now() / 1000);
    let newSk = generatePrivateKey();
    let pk = getPublicKey(newSk);
    const event = new NDKEvent(ndk);
    event.kind = Kind.Metadata;
    event.pubkey = pk;
    event.created_at = created_at;
    event.tags = [];
    event.content = JSON.stringify(values);
    dispatch(setSK(newSk));
    setMetadataEvent(event);
  };

  useEffect(() => {
    if (canPublishEvents && metadataEvent) {
      metadataEvent.publish().then(() => {
        setSk(authState.sk);
      });
    }
  }, [canPublishEvents, metadataEvent]);

  return sk ? (
    <Box pl="md" pr="md">
      <SignupComplete sk={sk} />
    </Box>
  ) : (
    <>
      <Head>
        <title>Stemstr - Signup</title>
      </Head>
      <Box pl="md" pr="md" pb="md">
        <SignupForm handleSubmit={handleSubmit} />
      </Box>
    </>
  );
}

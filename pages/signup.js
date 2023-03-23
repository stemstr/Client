import {
  generatePrivateKey,
  getEventHash,
  getPublicKey,
  Kind,
  signEvent,
} from "nostr-tools";
import { useState } from "react";
import SignupComplete from "../components/SignupComplete/SignupComplete";
import SignupForm from "../components/SignupForm/SignupForm";
import useNostr from "../nostr/hooks/useNostr";

export default function Signup() {
  const { publish } = useNostr();
  const [sk, setSk] = useState(null);

  const handleSubmit = (values) => {
    let created_at = Math.floor(Date.now() / 1000);
    let newSk = generatePrivateKey();
    let pk = getPublicKey(newSk);
    let event = {
      kind: Kind.Metadata,
      pubkey: pk,
      created_at: created_at,
      tags: [],
      content: JSON.stringify(values),
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, newSk);
    publish(event);
    setSk(newSk);
  };

  return sk ? (
    <SignupComplete sk={sk} />
  ) : (
    <SignupForm handleSubmit={handleSubmit} />
  );
}

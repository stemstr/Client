import { generatePrivateKey } from "nostr-tools";
import { useState } from "react";
import SignupComplete from "../components/SignupComplete/SignupComplete";
import SignupForm from "../components/SignupForm/SignupForm";

export default function Signup() {
  const [sk, setSk] = useState(null);

  const handleSubmit = (values) => {
    let sk = generatePrivateKey();

    setSk(sk);
  };

  return sk ? (
    <SignupComplete sk={sk} />
  ) : (
    <SignupForm handleSubmit={handleSubmit} />
  );
}

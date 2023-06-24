import { Text } from "@mantine/core";
import { getNormalizedName } from "../../ndk/utils";
import { useUser } from "../../ndk/hooks/useUser";
import { useEvent } from "../../ndk/NDKEventProvider";

const SendSatsHeader = () => {
  const { event } = useEvent();
  const user = useUser(event.pubkey);

  return (
    <Text color="white" ta="center" size="xl" fw="bold">
      ⚡️ Send{" "}
      <Text span color="purple.6">
        sats
      </Text>{" "}
      to {getNormalizedName(event.pubkey, user)}
    </Text>
  );
};

export default SendSatsHeader;

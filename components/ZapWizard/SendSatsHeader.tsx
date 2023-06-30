import { Text } from "@mantine/core";
import { getNormalizedName } from "../../ndk/utils";
import { useZapWizard } from "./ZapWizardProvider";
const SendSatsHeader = () => {
  const { zapRecipient } = useZapWizard();

  return (
    <Text color="white" ta="center" size="xl" fw="bold" truncate>
      ⚡️ Send{" "}
      <Text span color="purple.6">
        sats
      </Text>{" "}
      to {getNormalizedName(zapRecipient.hexpubkey(), zapRecipient)}
    </Text>
  );
};

export default SendSatsHeader;

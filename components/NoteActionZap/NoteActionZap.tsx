import { Space, Text, Group } from "@mantine/core";
import { ZapIcon } from "icons/StemstrIcon";
import NoteAction from "components/NoteAction/NoteAction";
import { useEvent } from "ndk/NDKEventProvider";
import { useUser } from "ndk/hooks/useUser";
import { getLnurlServiceEndpoint } from "ndk/utils";
import {
  ZapWizard,
  useZapWizard,
  ZapWizardProvider,
} from "components/ZapWizard";

const NoteActionContentWithZapWizard = ({
  zapsTotal,
}: {
  zapsTotal: number;
}) => {
  const { start } = useZapWizard();
  const formattedZapsTotal = (() => {
    const formatNumber = (num: number) => num.toFixed(1).replace(/\.0$/, "");

    if (zapsTotal >= 1_000_000) {
      return `${formatNumber(zapsTotal / 1_000_000)}M`;
    }

    if (zapsTotal >= 1000) {
      return `${formatNumber(zapsTotal / 1_000)}k`;
    }

    return formatNumber(zapsTotal);
  })();

  return (
    <NoteAction onClick={start}>
      <Group position="center" spacing={6} noWrap>
        <ZapIcon width={18} height={18} />
        {formattedZapsTotal && <Text lh="normal">{formattedZapsTotal}</Text>}
      </Group>
      <ZapWizard />
    </NoteAction>
  );
};

const NoteActionZap = ({ zapsTotal }: { zapsTotal: number }) => {
  const { event } = useEvent();
  const zapRecipient = useUser(event.pubkey);
  const isZappable =
    zapRecipient && getLnurlServiceEndpoint(zapRecipient.profile, event);

  return isZappable ? (
    <ZapWizardProvider zapRecipient={zapRecipient} zappedEvent={event}>
      <NoteActionContentWithZapWizard zapsTotal={zapsTotal} />
    </ZapWizardProvider>
  ) : (
    <Space w={44} />
  );
};

export default NoteActionZap;

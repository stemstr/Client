import { Text, Group, DefaultProps } from "@mantine/core";
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
import { useSelector } from "react-redux";
import { AppState } from "../../store/Store";
import { selectNoteState } from "../../store/Notes";

const ZapsAmountTotal = () => {
  const { event } = useEvent();
  const { zapsAmountTotal } = useSelector((state: AppState) =>
    selectNoteState(state, event.id)
  );
  const formattedZapsTotal = (() => {
    const formatNumber = (num: number) => num.toFixed(1).replace(/\.0$/, "");

    if (zapsAmountTotal === 0) {
      return;
    }

    if (zapsAmountTotal >= 1_000_000) {
      return `${formatNumber(zapsAmountTotal / 1_000_000)}M`;
    }

    if (zapsAmountTotal >= 1000) {
      return `${formatNumber(zapsAmountTotal / 1_000)}k`;
    }

    return formatNumber(zapsAmountTotal);
  })();

  return formattedZapsTotal ? (
    <Text lh="normal">{formattedZapsTotal}</Text>
  ) : null;
};

const NoteActionContentWithZapWizard = ({ size, c }: NoteActionZapProps) => {
  const { start } = useZapWizard();
  const { event } = useEvent();
  const { isZappedByCurrentUser } = useSelector((state: AppState) =>
    selectNoteState(state, event.id)
  );

  return (
    <NoteAction onClick={start}>
      <Group
        position="center"
        spacing={6}
        c={isZappedByCurrentUser ? "orange.5" : c}
        noWrap
      >
        <ZapIcon width={size} height={size} />
        <ZapsAmountTotal />
      </Group>
      <ZapWizard />
    </NoteAction>
  );
};

type NoteActionZapProps = DefaultProps & {
  size?: number;
};

const NoteActionZap = ({ size = 18, c = "gray.1" }: NoteActionZapProps) => {
  const { event } = useEvent();
  const zapRecipient = useUser(event.pubkey);
  let isZappable: boolean | undefined = false;

  try {
    isZappable =
      zapRecipient && !!getLnurlServiceEndpoint(zapRecipient.profile, event);
  } catch (err) {
    console.log(err);
  }

  return isZappable && zapRecipient ? (
    <ZapWizardProvider zapRecipient={zapRecipient} zappedEvent={event}>
      <NoteActionContentWithZapWizard size={size} c={c} />
    </ZapWizardProvider>
  ) : null;
};

export default NoteActionZap;

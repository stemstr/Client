import { ZapIcon } from "icons/StemstrIcon";
import NoteAction from "components/NoteAction/NoteAction";
import { useEvent } from "ndk/NDKEventProvider";
import { useUser } from "ndk/hooks/useUser";
import {
  ZapWizard,
  useZapWizard,
  ZapWizardProvider,
} from "components/ZapWizard";

const NoteActionContentWithZapWizard = () => {
  const { start } = useZapWizard();

  return (
    <NoteAction onClick={start}>
      <ZapIcon width={18} height={18} />
      <ZapWizard />
    </NoteAction>
  );
};

const NoteActionZap = () => {
  const { event } = useEvent();
  const zapRecipient = useUser(event.pubkey);

  return zapRecipient ? (
    <ZapWizardProvider zapRecipient={zapRecipient} zappedEvent={event}>
      <NoteActionContentWithZapWizard />
    </ZapWizardProvider>
  ) : (
    <NoteAction>
      <ZapIcon width={18} height={18} />
    </NoteAction>
  );
};

export default NoteActionZap;

import { ZapIcon } from "icons/StemstrIcon";
import NoteAction from "components/NoteAction/NoteAction";
import { useEvent } from "ndk/NDKEventProvider";
import { useUser } from "ndk/hooks/useUser";
import {
  ZapWizard,
  useZapWizard,
  withZapWizardProvider,
} from "components/ZapWizard";

const NoteActionZap = () => {
  const { event } = useEvent();
  const zapRecipient = useUser(event.pubkey);
  const { start } = useZapWizard();

  return (
    <NoteAction onClick={start}>
      <ZapIcon width={18} height={18} />

      {zapRecipient && <ZapWizard zapRecipient={zapRecipient} event={event} />}
    </NoteAction>
  );
};

export default withZapWizardProvider(NoteActionZap);

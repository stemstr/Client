import { useZapWizard, ZapWizard, ZapWizardProvider } from "../ZapWizard";
import ProfileActionButton from "../ProfileActionButton/ProfileActionButton";
import { ZapIcon } from "../../icons/StemstrIcon";
import { useUser } from "../../ndk/hooks/useUser";
import { getLnurlServiceEndpoint } from "../../ndk/utils";

export const ProfileActionZapButtonWithZapWizard = () => {
  const { start } = useZapWizard();

  return (
    <ProfileActionButton onClick={() => start()}>
      <ZapIcon width={16} height={16} />
      <ZapWizard />
    </ProfileActionButton>
  );
};

const ProfileActionZapButton = ({ pubkey }: { pubkey: string }) => {
  const zapRecipient = useUser(pubkey);
  let isZappable: boolean | undefined = false;

  try {
    isZappable =
      zapRecipient && !!getLnurlServiceEndpoint(zapRecipient.profile);
  } catch (err) {
    console.error(err);
  }

  return isZappable && zapRecipient ? (
    <ZapWizardProvider zapRecipient={zapRecipient}>
      <ProfileActionZapButtonWithZapWizard />
    </ZapWizardProvider>
  ) : null;
};

export default ProfileActionZapButton;

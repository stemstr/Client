import { useZapWizard, ZapWizard, ZapWizardProvider } from "../ZapWizard";
import ProfileActionButton from "../ProfileActionButton/ProfileActionButton";
import { ZapIcon } from "../../icons/StemstrIcon";
import { useUser } from "../../ndk/hooks/useUser";

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

  return zapRecipient ? (
    <ZapWizardProvider zapRecipient={zapRecipient}>
      <ProfileActionZapButtonWithZapWizard />
    </ZapWizardProvider>
  ) : (
    <ProfileActionButton>
      <ZapIcon width={16} height={16} />
    </ProfileActionButton>
  );
};

export default ProfileActionZapButton;

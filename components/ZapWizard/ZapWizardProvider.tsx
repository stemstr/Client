import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";
import { type NDKEvent, type NDKUser } from "@nostr-dev-kit/ndk";

type ZapWizardStep = "idle" | "defaultAmounts" | "customAmount" | "invoice";

interface ZapWizardContextProps {
  step: ZapWizardStep;
  setStep: (step: ZapWizardStep) => void;
  start: Function;
  end: Function;
  zapRecipient: NDKUser;
  zappedEvent?: NDKEvent;
}

const ZapWizardContext = createContext<ZapWizardContextProps>({
  step: "idle",
  setStep: () => {},
  start: () => {},
  end: () => {},
  zapRecipient: {} as NDKUser,
});

export const ZapWizardProvider = ({
  zapRecipient,
  zappedEvent,
  children,
}: PropsWithChildren<{ zapRecipient: NDKUser; zappedEvent?: NDKEvent }>) => {
  const [step, setStep] = useState<ZapWizardStep>("idle");

  return (
    <ZapWizardContext.Provider
      value={{
        step,
        setStep,
        start: () => setStep("defaultAmounts"),
        end: () => setStep("idle"),
        zapRecipient,
        zappedEvent,
      }}
    >
      {children}
    </ZapWizardContext.Provider>
  );
};

export const useZapWizard = () => {
  const context = useContext(ZapWizardContext);
  if (context === undefined) {
    throw new Error("useStep must be used within an ZapWizardProvider");
  }
  return context;
};

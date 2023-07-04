import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";
import { type NDKEvent, type NDKUser } from "@nostr-dev-kit/ndk";
import { useMediaQuery } from "@mantine/hooks";

type ZapWizardStep = "idle" | "defaultAmounts" | "customAmount" | "invoice";

interface ZapWizardContextProps {
  step: ZapWizardStep;
  setStep: (step: ZapWizardStep) => void;
  start: Function;
  end: Function;
  zapRecipient: NDKUser;
  zappedEvent?: NDKEvent;
  verticalSectionGap: number;
  willShowCloseButton: boolean;
}

const ZapWizardContext = createContext<ZapWizardContextProps | null>(null);

export const ZapWizardProvider = ({
  zapRecipient,
  zappedEvent,
  children,
}: PropsWithChildren<{ zapRecipient: NDKUser; zappedEvent?: NDKEvent }>) => {
  const [step, setStep] = useState<ZapWizardStep>("idle");
  const isHeightSmall = useMediaQuery("(max-height: 896px)");

  return (
    <ZapWizardContext.Provider
      value={{
        step,
        setStep,
        start: () => setStep("defaultAmounts"),
        end: () => setStep("idle"),
        zapRecipient,
        zappedEvent,
        verticalSectionGap: isHeightSmall ? 16 : 21,
        willShowCloseButton: !isHeightSmall,
      }}
    >
      {children}
    </ZapWizardContext.Provider>
  );
};

export const useZapWizard = () => {
  const context = useContext(ZapWizardContext);
  if (context === null) {
    throw new Error("useStep must be used within an ZapWizardProvider");
  }
  return context;
};

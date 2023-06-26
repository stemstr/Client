import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";

type ZapWizardStep = "idle" | "defaultAmounts" | "customAmount" | "invoice";

interface ZapWizardContextProps {
  step: ZapWizardStep;
  setStep: (step: ZapWizardStep) => void;
  start: Function;
}

const ZapWizardContext = createContext<ZapWizardContextProps>({
  step: "idle",
  setStep: () => {},
  start: () => {},
});

export const ZapWizardProvider = ({ children }: PropsWithChildren) => {
  const [step, setStep] = useState<ZapWizardStep>("idle");

  return (
    <ZapWizardContext.Provider
      value={{ step, setStep, start: () => setStep("defaultAmounts") }}
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

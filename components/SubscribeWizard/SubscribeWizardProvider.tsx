import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";

type SubscribeWizardStep = "idle" | "intro" | "selectPass" | "paymentComplete";

interface SubscribeWizardContextProps {
  step: SubscribeWizardStep;
  setStep: (step: SubscribeWizardStep) => void;
  start: () => void;
  end: () => void;
}

const SubscribeWizardContext =
  createContext<SubscribeWizardContextProps | null>(null);

export const SubscribeWizardProvider = ({ children }: PropsWithChildren) => {
  const [step, setStep] = useState<SubscribeWizardStep>("idle");

  return (
    <SubscribeWizardContext.Provider
      value={{
        step,
        setStep,
        start: () => setStep("intro"),
        end: () => setStep("idle"),
      }}
    >
      {children}
    </SubscribeWizardContext.Provider>
  );
};

export const useSubscribeWizard = () => {
  const context = useContext(SubscribeWizardContext);
  if (context === null) {
    throw new Error(
      "useSubscribeWizard must be used within an SubscribeWizardProvider"
    );
  }
  return context;
};

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type SubscribeWizardStep = "idle" | "intro" | "selectPass" | "paymentComplete";

export type PassOption = {
  numDays: number;
  priceSATS: number;
  priceUSD: number;
};

interface SubscribeWizardContextProps {
  step: SubscribeWizardStep;
  setStep: (step: SubscribeWizardStep) => void;
  start: () => void;
  end: () => void;
  passOption?: PassOption;
  setPassOption: Dispatch<SetStateAction<PassOption | undefined>>;
}

const SubscribeWizardContext =
  createContext<SubscribeWizardContextProps | null>(null);

export const SubscribeWizardProvider = ({ children }: PropsWithChildren) => {
  const [step, setStep] = useState<SubscribeWizardStep>("idle");
  const [passOption, setPassOption] = useState<PassOption>();

  return (
    <SubscribeWizardContext.Provider
      value={{
        step,
        setStep,
        start: () => setStep("intro"),
        end: () => setStep("idle"),
        passOption,
        setPassOption,
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

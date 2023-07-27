import axios from "axios";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

type SubscribeWizardStep = "idle" | "intro" | "selectPass" | "paymentComplete";

export type PassOption = {
  numDays: number;
  priceSATS: number;
  priceUSD?: number;
};

interface SubscribeWizardContextProps {
  step: SubscribeWizardStep;
  setStep: (step: SubscribeWizardStep) => void;
  start: () => void;
  end: () => void;
  passOptions: PassOption[];
  selectedPassOption?: PassOption;
  setSelectedPassOption: Dispatch<SetStateAction<PassOption | undefined>>;
  invoice?: string;
  setInvoice: Dispatch<SetStateAction<string | undefined>>;
}

const SubscribeWizardContext =
  createContext<SubscribeWizardContextProps | null>(null);

export const SubscribeWizardProvider = ({ children }: PropsWithChildren) => {
  const [step, setStep] = useState<SubscribeWizardStep>("idle");
  const [passOptions, setPassOptions] = useState<PassOption[]>([]);
  const [selectedPassOption, setSelectedPassOption] = useState<PassOption>();
  const [invoice, setInvoice] = useState<string>();

  const fetchPassOptions = (): Promise<PassOption[]> => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${process.env.NEXT_PUBLIC_STEMSTR_API}/subscription`)
        .then((response) => {
          const fetchedPassOptions: PassOption[] = response.data.map(
            (option: any) => ({
              numDays: option.days,
              priceSATS: option.sats,
            })
          );
          resolve(fetchedPassOptions);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  useEffect(() => {
    fetchPassOptions()
      .then((fetchedPassOptions) => {
        setPassOptions(fetchedPassOptions);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <SubscribeWizardContext.Provider
      value={{
        step,
        setStep,
        start: () => setStep("intro"),
        end: () => setStep("idle"),
        passOptions,
        selectedPassOption,
        setSelectedPassOption,
        invoice,
        setInvoice,
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

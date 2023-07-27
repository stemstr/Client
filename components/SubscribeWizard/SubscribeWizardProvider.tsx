import axios from "axios";
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
  selectedPass: string;
  setSelectedPass: Dispatch<SetStateAction<string>>;
  isFetchingInvoice: boolean;
  setIsFetchingInvoice: Dispatch<SetStateAction<boolean>>;
}

const SubscribeWizardContext =
  createContext<SubscribeWizardContextProps | null>(null);

export const SubscribeWizardProvider = ({ children }: PropsWithChildren) => {
  const [step, setStep] = useState<SubscribeWizardStep>("idle");
  const [passOptions, setPassOptions] = useState<PassOption[]>([]);
  const [selectedPassOption, setSelectedPassOption] = useState<PassOption>();
  const [invoice, setInvoice] = useState<string>();
  const [selectedPass, setSelectedPass] = useState("0");
  const [isFetchingInvoice, setIsFetchingInvoice] = useState(false);

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

  const start = () => {
    setStep("intro");
    fetchPassOptions()
      .then((fetchedPassOptions) => {
        setPassOptions(fetchedPassOptions);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const end = () => {
    setStep("idle");
    setPassOptions([]);
    setSelectedPassOption(undefined);
    setInvoice(undefined);
    setSelectedPass("0");
    setIsFetchingInvoice(false);
  };

  return (
    <SubscribeWizardContext.Provider
      value={{
        step,
        setStep,
        start,
        end,
        passOptions,
        selectedPassOption,
        setSelectedPassOption,
        invoice,
        setInvoice,
        selectedPass,
        setSelectedPass,
        isFetchingInvoice,
        setIsFetchingInvoice,
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

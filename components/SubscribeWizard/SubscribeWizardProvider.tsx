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
}

const SubscribeWizardContext =
  createContext<SubscribeWizardContextProps | null>(null);

export const SubscribeWizardProvider = ({ children }: PropsWithChildren) => {
  const [step, setStep] = useState<SubscribeWizardStep>("idle");
  const [passOptions, setPassOptions] = useState<PassOption[]>([]);
  const [selectedPassOption, setSelectedPassOption] = useState<PassOption>();

  const fetchPassOptions = (): Promise<PassOption[]> => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${process.env.NEXT_PUBLIC_STEMSTR_API}/subscription`)
        .then((response) => {
          try {
            const data = JSON.parse(response.data);
            const fetchedPassOptions: PassOption[] = data.map(
              (option: any) => ({
                numDays: option.days,
                priceSATS: option.sats,
              })
            );
            resolve(fetchedPassOptions);
          } catch (err) {
            reject(err);
          }
        })
        .catch((err) => {
          // TODO: Uncomment this
          // reject(err);
        })
        .finally(() => {
          // TODO: Remove this
          resolve([
            { numDays: 1, priceSATS: 100, priceUSD: 0.02 },
            { numDays: 7, priceSATS: 1000, priceUSD: 0.2 },
            { numDays: 30, priceSATS: 10000, priceUSD: 2 },
            { numDays: 180, priceSATS: 60000, priceUSD: 12 },
          ]);
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

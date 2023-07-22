import { useCallback, useEffect } from "react";
import { useSubscribeWizard } from "./SubscribeWizardProvider";
import SubscribeIntroDrawer from "./SubscribeIntroDrawer";
import SubscribeSelectPassDrawer from "./SubscribeSelectPassDrawer";
import SubscribePaymentCompleteDrawer from "./SubscribePaymentCompleteDrawer";

export const SubscribeWizard = () => {
  const { step, setStep } = useSubscribeWizard();

  const handleDrawerClose = useCallback(() => {
    setStep("idle");
  }, [setStep]);

  useEffect(() => {
    if (step === "idle") {
    }
  }, [step]);

  return (
    <>
      <SubscribeIntroDrawer
        position="bottom"
        opened={step === "intro"}
        onClose={handleDrawerClose}
        onContinue={() => setStep("selectPass")}
      />
      <SubscribeSelectPassDrawer
        position="bottom"
        opened={step === "selectPass"}
        onClose={handleDrawerClose}
        onBack={() => setStep("intro")}
        onContinue={() => setStep("paymentComplete")}
      />
      <SubscribePaymentCompleteDrawer
        position="bottom"
        opened={step === "paymentComplete"}
        onClose={handleDrawerClose}
      />
    </>
  );
};

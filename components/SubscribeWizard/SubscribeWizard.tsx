import { useCallback, useEffect, useRef, useState } from "react";
import { createZapRequest } from "../../ndk/utils";
import { useNDK } from "../../ndk/NDKProvider";
import useAuth from "../../hooks/useAuth";
import { useUser } from "../../ndk/hooks/useUser";
import { useSubscribeWizard } from "./SubscribeWizardProvider";
import SubscribeIntroDrawer from "./SubscribeIntroDrawer";

export const SubscribeWizard = () => {
  const { ndk } = useNDK();
  const { authState, isAuthenticated } = useAuth();
  const currentUser = useUser(authState.pk);
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
      {/* <CustomAmountDrawer
        isOpen={step === "customAmount"}
        onClose={handleDrawerClose}
        onContinue={handleContinueClick}
        onReturnToZapOptionsClick={() => {
          setStep("defaultAmounts");
        }}
        onCommentChange={handleCommentChange}
        comment={comment.current}
      />
      <InvoiceDrawer
        isOpen={step === "invoice"}
        onClose={handleDrawerClose}
        amount={amount.current}
        comment={comment.current}
        invoice={invoice ?? ""}
        zapReceiptRelays={zapReceiptRelays}
      /> */}
    </>
  );
};

import { useCallback, useEffect, useRef, useState } from "react";
import ZapOptionsDrawer from "./ZapOptionsDrawer";
import CustomAmountDrawer from "./CustomAmountDrawer";
import InvoiceDrawer from "./InvoiceDrawer";
import { createZapRequest } from "../../ndk/utils";
import { useNDK } from "../../ndk/NDKProvider";
import useAuth from "../../hooks/useAuth";
import { useZapWizard } from "./ZapWizardProvider";

export const ZapWizard = () => {
  const { ndk } = useNDK();
  const { isAuthenticated } = useAuth();
  const [invoice, setInvoice] = useState<string | null>(null);
  const [zapReceiptRelays, setZapReceiptRelays] = useState<string[]>([]);
  const amount = useRef<number>(0);
  const comment = useRef<string>("");
  const { step, setStep, zapRecipient, zappedEvent } = useZapWizard();
  const handleContinueClick = async (satsAmount: number) => {
    amount.current = satsAmount;

    try {
      const { invoice, relays } = await createZapRequest({
        amount: satsAmount,
        comment: comment.current,
        zappedUser: zapRecipient!, // the zapRecipient must exist if we've gotten to this point
        zappedEvent,
        ndk: ndk!,
        isAnonymous: !isAuthenticated,
      });

      setInvoice(invoice);
      setZapReceiptRelays(relays);
      setStep("invoice");
    } catch (error) {
      // TODO: let user know that something went wrong
      console.error(error);
    }
  };
  const handleCommentChange = (value: string) => {
    comment.current = value;
  };
  const handleDrawerClose = useCallback(() => {
    setStep("idle");
  }, [setStep]);

  useEffect(() => {
    if (step === "idle") {
      comment.current = "";
      setInvoice(null);
    }
  }, [step]);

  return (
    <>
      <ZapOptionsDrawer
        isOpen={step === "defaultAmounts"}
        onClose={handleDrawerClose}
        onContinue={handleContinueClick}
        onCustomClick={() => {
          setStep("customAmount");
        }}
        onCommentChange={handleCommentChange}
        comment={comment.current}
      />
      <CustomAmountDrawer
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
      />
    </>
  );
};

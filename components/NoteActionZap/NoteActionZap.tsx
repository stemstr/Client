import { ZapIcon } from "icons/StemstrIcon";
import NoteAction from "components/NoteAction/NoteAction";
import { useCallback, useRef, useState } from "react";
import ZapOptionsDrawer from "./ZapOptionsDrawer";
import CustomAmountDrawer from "./CustomAmountDrawer";
import InvoiceDrawer from "./InvoiceDrawer";
import { useEvent } from "../../ndk/NDKEventProvider";
import { useUser } from "../../ndk/hooks/useUser";
import { createZapRequest } from "../../ndk/utils";
import { useNDK } from "../../ndk/NDKProvider";
import useAuth from "../../hooks/useAuth";

const NoteActionZap = () => {
  const { ndk } = useNDK();
  const { event } = useEvent();
  const { isAuthenticated } = useAuth();
  const zapRecipient = useUser(event.pubkey);
  const [isZapOptionsDrawerOpen, setIsZapOptionsDrawerOpen] = useState(false);
  const [isCustomAmountDrawerOpen, setIsCustomAmountDrawerOpen] =
    useState(false);
  const [invoice, setInvoice] = useState<string | null>(null);
  const amount = useRef<number>(0);
  const comment = useRef<string>("");
  const handleNoteActionClick = () => {
    setIsZapOptionsDrawerOpen(true);
    comment.current = "";
  };
  const handleContinueClick = async (satsAmount: number) => {
    amount.current = satsAmount;

    try {
      const invoice = await createZapRequest({
        amount: satsAmount,
        comment: comment.current,
        zappedUser: zapRecipient!, // the zapRecipient must exist if we've gotten to this point
        zappedEvent: event,
        ndk: ndk!,
        isAnonymous: !isAuthenticated,
      });

      setIsZapOptionsDrawerOpen(false);
      setIsCustomAmountDrawerOpen(false);
      setInvoice(invoice);
    } catch (error) {
      // TODO: let user know that something went wrong
      console.error(error);
    }
  };
  const handleCustomAmountClick = () => {
    setIsZapOptionsDrawerOpen(false);
    setIsCustomAmountDrawerOpen(true);
  };
  const handleCommentChange = (value: string) => {
    comment.current = value;
  };
  const handleOnReturnToZapOptionsClick = () => {
    setIsCustomAmountDrawerOpen(false);
    setIsZapOptionsDrawerOpen(true);
  };
  const handleZapOptionsDrawerClose = useCallback(() => {
    setIsZapOptionsDrawerOpen(false);
  }, []);
  const handleCustomAmountDrawerClose = useCallback(() => {
    setIsCustomAmountDrawerOpen(false);
  }, []);
  const handleInvoiceDrawerClose = useCallback(() => {
    setInvoice(null);
  }, []);

  return (
    <NoteAction onClick={handleNoteActionClick}>
      <ZapIcon width={18} height={18} />
      <ZapOptionsDrawer
        isOpen={isZapOptionsDrawerOpen}
        onClose={handleZapOptionsDrawerClose}
        onContinue={handleContinueClick}
        onCustomClick={handleCustomAmountClick}
        onCommentChange={handleCommentChange}
        comment={comment.current}
      />
      <CustomAmountDrawer
        isOpen={isCustomAmountDrawerOpen}
        onClose={handleCustomAmountDrawerClose}
        onContinue={handleContinueClick}
        onReturnToZapOptionsClick={handleOnReturnToZapOptionsClick}
        onCommentChange={handleCommentChange}
        comment={comment.current}
      />
      <InvoiceDrawer
        isOpen={invoice !== null}
        onClose={handleInvoiceDrawerClose}
        amount={amount.current}
        comment={comment.current}
        invoice={invoice ?? ""}
      />
    </NoteAction>
  );
};

export default NoteActionZap;

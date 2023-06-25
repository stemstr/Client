import { ZapIcon } from "icons/StemstrIcon";
import NoteAction from "components/NoteAction/NoteAction";
import { useCallback, useRef, useState } from "react";
import ZapOptionsDrawer from "./ZapOptionsDrawer";
import CustomAmountDrawer from "./CustomAmountDrawer";
import InvoiceDrawer from "./InvoiceDrawer";

const NoteActionZap = () => {
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

    // TODO: fetch real invoice for zap
    const invoice =
      "lnbc210n1pjf0p0tpp570nknrhks9k79mwtnqpgxvj7g0mvw5a6edzgjwgwtgzu0hzkf7asdqu2askcmr9wssx7e3q2dshgmmndp5scqzzsxqyz5vqsp5mde7m46qd80nfflr3krsgx29ru3uvv8gvf3ttzrs9280f8pwgsys9qyyssq2p7drxdgr9l85t27rws8eqpemn6e72mj69x6yxe35rjs4xtkwqhkg0393wrjn7aga0s027gmz62fukejyu97j2cva482ngngll7xgrqqgm24l8";

    try {
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

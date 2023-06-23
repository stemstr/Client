import { ZapIcon } from "icons/StemstrIcon";
import NoteAction from "./NoteAction";
import { useCallback, useRef, useState } from "react";
import ZapOptionsDrawer from "./ZapOptionsDrawer";
import CustomAmountDrawer from "./CustomAmountDrawer";

const NoteActionZap = () => {
  const [isZapOptionsDrawerOpen, setIsZapOptionsDrawerOpen] = useState(false);
  const [isCustomAmountDrawerOpen, setIsCustomAmountDrawerOpen] =
    useState(false);
  const comment = useRef<string>("");
  const handleNoteActionClick = () => {
    setIsZapOptionsDrawerOpen(true);
    comment.current = "";
  };
  const fetchInvoice = async (satsAmount: number) => {
    // TODO: fetch invoice
    console.log({ satsAmount, comment: comment.current });
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

  return (
    <NoteAction onClick={handleNoteActionClick}>
      <ZapIcon width={18} height={18} />
      <ZapOptionsDrawer
        isOpen={isZapOptionsDrawerOpen}
        onClose={handleZapOptionsDrawerClose}
        onContinue={fetchInvoice}
        onCustomClick={handleCustomAmountClick}
        onCommentChange={handleCommentChange}
        comment={comment.current}
      />
      <CustomAmountDrawer
        isOpen={isCustomAmountDrawerOpen}
        onClose={handleCustomAmountDrawerClose}
        onContinue={fetchInvoice}
        onReturnToZapOptionsClick={handleOnReturnToZapOptionsClick}
        onCommentChange={handleCommentChange}
        comment={comment.current}
      />
    </NoteAction>
  );
};

export default NoteActionZap;

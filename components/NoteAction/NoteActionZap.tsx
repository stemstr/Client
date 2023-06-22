import { ZapIcon } from "icons/StemstrIcon";
import NoteAction from "./NoteAction";
import { useState } from "react";
import ZapInfoDrawer from "./ZapInfoDrawer";

const NoteActionZap = () => {
  const [isDefaultSatAmountsDrawerOpen, setIsDefaultSatAmountsDrawerOpen] =
    useState(false);
  const handleOnClick = () => {
    setIsDefaultSatAmountsDrawerOpen(true);
  };
  const handleClose = () => {
    setIsDefaultSatAmountsDrawerOpen(false);
  };
  const fetchInvoice = async (satsAmount: number, comment?: string) => {
    // TODO: fetch invoice
    console.log({ satsAmount, comment });
  };

  return (
    <NoteAction onClick={handleOnClick}>
      <ZapIcon width={18} height={18} />
      <ZapInfoDrawer
        isOpen={isDefaultSatAmountsDrawerOpen}
        onClose={handleClose}
        onContinue={fetchInvoice}
      />
    </NoteAction>
  );
};

export default NoteActionZap;

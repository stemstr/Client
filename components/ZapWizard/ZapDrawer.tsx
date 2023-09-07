import { type PropsWithChildren } from "react";
import { useZapWizard } from "./ZapWizardProvider";
import Drawer from "../Drawer/Drawer";

interface ZapDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ZapDrawer = ({
  isOpen,
  onClose,
  children,
}: PropsWithChildren<ZapDrawerProps>) => {
  const { end } = useZapWizard();

  return (
    <Drawer opened={isOpen} onClose={onClose} onDragEnd={end} padding="md">
      {children}
    </Drawer>
  );
};

export default ZapDrawer;

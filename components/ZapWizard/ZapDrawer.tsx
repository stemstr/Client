import { Drawer as MantineDrawer, type MantineTheme } from "@mantine/core";
import withStopClickPropagation from "../../utils/hoc/withStopClickPropagation";
import {
  type MouseEventHandler,
  type PropsWithChildren,
  type SyntheticEvent,
  useState,
} from "react";
import ZapDrawerHandle from "./ZapDrawerHandle";
import { useZapWizard } from "./ZapWizardProvider";
import { noop } from "../../utils/common";

const Drawer = withStopClickPropagation(MantineDrawer);

interface ZapDrawerProps {
  isOpen: boolean;
  onClose: MouseEventHandler;
  size: number;
}

const ZapDrawer = ({
  isOpen,
  onClose,
  size,
  children,
}: PropsWithChildren<ZapDrawerProps>) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const { end } = useZapWizard();

  const getClientY = (event: SyntheticEvent) => {
    if (event.nativeEvent instanceof TouchEvent) {
      return event.nativeEvent.touches[0].clientY;
    }

    if (event.nativeEvent instanceof MouseEvent) {
      return event.nativeEvent.clientY;
    }

    throw new Error("Invalid event type");
  };

  const handleDragStart = (event: SyntheticEvent) => {
    const clientY = getClientY(event);

    setIsDragging(true);
    setStartY(clientY);
    setCurrentY(clientY);
  };

  const handleDrag = (event: SyntheticEvent) => {
    const clientY = getClientY(event);

    if (isDragging && clientY > startY) {
      setCurrentY(clientY);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    if (currentY - startY > 100) {
      end();

      // reset values after transition to prevent flash of content
      setTimeout(() => {
        setStartY(0);
        setCurrentY(0);
        setIsDragging(false);
      }, 500);
    } else {
      setStartY(currentY);
    }
  };

  return (
    <Drawer
      opened={isOpen}
      onClose={onClose}
      position="bottom"
      withCloseButton={false}
      trapFocus={false}
      size={size - (currentY - startY)}
      styles={(theme: MantineTheme) => ({
        overlay: {
          backgroundColor: `${theme.colors.dark[7]} !important`,
          backdropFilter: "blur(16px)",
          opacity: `${0.5} !important`,
        },
        drawer: {
          backgroundColor: theme.colors.dark[8],
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          maxWidth: 600,
          margin: "auto",
          padding: "0 16px 48px 16px !important",
        },
      })}
    >
      <ZapDrawerHandle
        pt={24}
        pb={21}
        onMouseDown={isOpen ? handleDragStart : noop}
        onMouseMove={isOpen ? handleDrag : noop}
        onMouseUp={isOpen ? handleDragEnd : noop}
        onMouseOut={isOpen ? handleDragEnd : noop}
        onTouchStart={isOpen ? handleDragStart : noop}
        onTouchMove={isOpen ? handleDrag : noop}
        onTouchEnd={isOpen ? handleDragEnd : noop}
      />
      {children}
    </Drawer>
  );
};

export default ZapDrawer;

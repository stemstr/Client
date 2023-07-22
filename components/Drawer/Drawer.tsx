import {
  Drawer as BaseDrawer,
  type DrawerProps as BaseDrawerProp,
} from "@mantine/core";
import withStopClickPropagation from "../../utils/hoc/withStopClickPropagation";
import {
  type PropsWithChildren,
  type SyntheticEvent,
  useRef,
  useState,
} from "react";
import DrawerHandle from "./DrawerHandle";
import { noop } from "../../utils/common";
import { useMediaQuery } from "@mantine/hooks";

const MantineDrawer = withStopClickPropagation<any>(BaseDrawer);

export interface DrawerProps extends BaseDrawerProp {
  onDragEnd?: () => void;
}

const Drawer = ({
  onDragEnd = noop,
  children,
  ...rest
}: PropsWithChildren<DrawerProps>) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const isHeightSmall = useMediaQuery("(max-height: 896px)");
  const isOpened = rest.opened;
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<number | string>("auto");

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

      if (containerRef.current) {
        setSize(containerRef.current.clientHeight - (currentY - startY));
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    if (currentY - startY > 50) {
      onDragEnd();

      // reset values after transition to prevent flash of content
      setTimeout(() => {
        setStartY(0);
        setCurrentY(0);
        setIsDragging(false);
        setSize("auto");
      }, 500);
    } else {
      setStartY(currentY);
    }
  };

  return (
    <MantineDrawer {...rest} size={size}>
      <div ref={containerRef}>
        <DrawerHandle
          pt={24}
          pb={isHeightSmall ? 16 : 21}
          onMouseDown={isOpened ? handleDragStart : noop}
          onMouseMove={isOpened ? handleDrag : noop}
          onMouseUp={isOpened ? handleDragEnd : noop}
          onMouseOut={isOpened ? handleDragEnd : noop}
          onTouchStart={isOpened ? handleDragStart : noop}
          onTouchMove={isOpened ? handleDrag : noop}
          onTouchEnd={isOpened ? handleDragEnd : noop}
        />
        {children}
      </div>
    </MantineDrawer>
  );
};

export default Drawer;

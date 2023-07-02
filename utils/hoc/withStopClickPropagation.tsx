import { Box } from "@mantine/core";
import { ComponentType } from "react";

interface WithStopClickPropagationProps {
  children: any;
}

const withStopClickPropagation = <P extends WithStopClickPropagationProps>(
  WrappedComponent: ComponentType<P>
) => {
  const StopClickPropagationHOC = (props: P) => {
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    return (
      <Box onClick={handleClick} sx={{ cursor: "initial" }}>
        <WrappedComponent {...props} />
      </Box>
    );
  };

  return StopClickPropagationHOC;
};

export default withStopClickPropagation;

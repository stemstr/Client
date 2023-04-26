import { Box } from "@mantine/core";

const withStopClickPropagation = (WrappedComponent) => {
  const StopClickPropagationHOC = (props) => {
    const handleClick = (e) => {
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

import { Button, Divider, Flex, Space, Stack, Text } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import ZapDrawer from "./ZapDrawer";
import SquareButton from "./SquareButton";
import SquareButtonRow from "./SquareButtonRow";
import SendSatsHeader from "./SendSatsHeader";
import ZapCommentFieldGroup from "./ZapCommentFieldGroup";
import DrawerCloseButton from "./CloseButton";

interface CustomAmountDrawerProps {
  isOpen: boolean;
  onClose: Function;
  onContinue: (satsAmount: number) => void;
  onReturnToZapOptionsClick: () => void;
  onCommentChange: (comment: string) => void;
  comment: string;
}

const CustomAmountDrawer = ({
  isOpen,
  onClose,
  onContinue,
  onReturnToZapOptionsClick,
  onCommentChange,
  comment,
}: CustomAmountDrawerProps) => {
  const [satsAmount, setSatsAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const resetValues = useCallback(() => {
    setSatsAmount("");
    setIsLoading(false);
  }, []);
  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);
  const renderNumberSquareButton = (n: number) => {
    const maxDigits = 7;

    return (
      <SquareButton
        key={n}
        label={n}
        onClick={() =>
          setSatsAmount((prev) =>
            prev.length === maxDigits ? prev : `${prev}${n}`
          )
        }
      />
    );
  };
  const handleContinueClick = () => {
    setIsLoading(true);
    onContinue(Number(satsAmount));
  };

  useEffect(() => {
    if (!isOpen) {
      resetValues();
    }
  }, [isOpen, resetValues]);

  return (
    <ZapDrawer isOpen={isOpen} onClose={handleOnClose} size={876}>
      <Stack spacing={21}>
        <SendSatsHeader />
        <Text color="purple.6" align="center" fz={50} fw="bold">
          {satsAmount ? Number(satsAmount).toLocaleString() : 0} sats
        </Text>
        <SquareButtonRow>
          {[1, 2, 3].map(renderNumberSquareButton)}
        </SquareButtonRow>
        <SquareButtonRow>
          {[4, 5, 6].map(renderNumberSquareButton)}
        </SquareButtonRow>
        <SquareButtonRow>
          {[7, 8, 9].map(renderNumberSquareButton)}
        </SquareButtonRow>
        <SquareButtonRow>
          <Space h={80} w={80} />
          {renderNumberSquareButton(0)}
          <SquareButton
            variant="subtle"
            label="<"
            labelProps={{ fz: 48, fw: 400 }}
            onClick={() => setSatsAmount((prev) => prev.slice(0, -1))}
          />
        </SquareButtonRow>
        <ZapCommentFieldGroup
          defaultValue={comment}
          onChange={onCommentChange}
        />
        <Flex mt={24} gap={16} sx={{ flexGrow: 1 }}>
          <Button
            color="gray.6"
            onClick={() => onReturnToZapOptionsClick()}
            fullWidth
            disabled={isLoading}
          >
            &lt;&nbsp;&nbsp; Return to zap options
          </Button>
          <Button onClick={handleContinueClick} fullWidth loading={isLoading}>
            Continue
          </Button>
        </Flex>
        <Divider color="gray.4" />
        <DrawerCloseButton onClick={handleOnClose} />
      </Stack>
    </ZapDrawer>
  );
};

export default CustomAmountDrawer;

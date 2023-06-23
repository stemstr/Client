import { Button, Flex, Space, Stack, Text } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import ZapDrawer from "./ZapDrawer";
import SquareButton from "./SquareButton";
import SquareButtonRow from "./SquareButtonRow";
import SendSatsHeader from "./SendSatsHeader";
import ZapCommentFieldGroup from "./ZapCommentFieldGroup";

interface ZapOptionsDrawerProps {
  isOpen: boolean;
  onClose: Function;
  onContinue: (satsAmount: number) => void;
  onReturnToZapOptionsClick: () => void;
  onCommentChange: (comment: string) => void;
  comment: string;
}

const ZapOptionsDrawer = ({
  isOpen,
  onClose,
  onContinue,
  onReturnToZapOptionsClick,
  onCommentChange,
  comment,
}: ZapOptionsDrawerProps) => {
  const [satsAmount, setSatsAmount] = useState("");
  const handleOnClose = useCallback(() => {
    setSatsAmount("");
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

  useEffect(() => {
    if (!isOpen) {
      handleOnClose();
    }
  }, [isOpen, handleOnClose]);

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
          >
            &lt;&nbsp;&nbsp; Return to zap options
          </Button>
          <Button onClick={() => onContinue(Number(satsAmount))} fullWidth>
            Continue
          </Button>
        </Flex>
      </Stack>
    </ZapDrawer>
  );
};

export default ZapOptionsDrawer;

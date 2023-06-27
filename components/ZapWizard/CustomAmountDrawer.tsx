import { Button, Divider, Flex, Space, Stack, Text } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import ZapDrawer from "./ZapDrawer";
import SquareButton from "./SquareButton";
import SquareButtonRow from "./SquareButtonRow";
import SendSatsHeader from "./SendSatsHeader";
import ZapCommentFieldGroup from "./ZapCommentFieldGroup";
import DrawerCloseButton from "./CloseButton";
import { useZapWizard } from "./ZapWizardProvider";
import AmountContinueButton from "./AmountContinueButton";

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
  const { verticalSectionGap, willShowCloseButton } = useZapWizard();
  const [satsAmount, setSatsAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const buttonSize = willShowCloseButton ? 80 : 70;
  const squareButtonRowPx = 64;
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
        w={buttonSize}
        h={buttonSize}
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
    <ZapDrawer
      isOpen={isOpen}
      onClose={handleOnClose}
      size={willShowCloseButton ? 876 : 613}
    >
      <Stack spacing={verticalSectionGap}>
        <SendSatsHeader />
        <Text
          color="purple.6"
          align="center"
          fz={willShowCloseButton ? 50 : 48}
          fw="bold"
          h={willShowCloseButton ? undefined : 46}
          sx={{ lineHeight: willShowCloseButton ? undefined : "46px" }}
        >
          {satsAmount ? Number(satsAmount).toLocaleString() : 0} sats
        </Text>
        <Stack spacing={willShowCloseButton ? verticalSectionGap : 12}>
          <SquareButtonRow px={squareButtonRowPx}>
            {[1, 2, 3].map(renderNumberSquareButton)}
          </SquareButtonRow>
          <SquareButtonRow px={squareButtonRowPx}>
            {[4, 5, 6].map(renderNumberSquareButton)}
          </SquareButtonRow>
          <SquareButtonRow px={squareButtonRowPx}>
            {[7, 8, 9].map(renderNumberSquareButton)}
          </SquareButtonRow>
          <SquareButtonRow px={squareButtonRowPx}>
            <Space h={buttonSize} w={buttonSize} />
            {renderNumberSquareButton(0)}
            <SquareButton
              variant="subtle"
              label="<"
              labelProps={{ fz: 48, fw: 400 }}
              onClick={() => setSatsAmount((prev) => prev.slice(0, -1))}
            />
          </SquareButtonRow>
        </Stack>
        <ZapCommentFieldGroup
          defaultValue={comment}
          onChange={onCommentChange}
          compact={!willShowCloseButton}
        />
        <Flex mt={willShowCloseButton ? 24 : 0} gap={16} sx={{ flexGrow: 1 }}>
          {willShowCloseButton && (
            <Button
              color="gray.6"
              onClick={() => onReturnToZapOptionsClick()}
              fullWidth
              disabled={isLoading}
            >
              &lt;&nbsp;&nbsp; Return to zap options
            </Button>
          )}
          <AmountContinueButton
            onClick={handleContinueClick}
            fullWidth
            loading={isLoading}
          />
        </Flex>
        {willShowCloseButton && (
          <>
            <Divider color="gray.4" />
            <DrawerCloseButton onClick={handleOnClose} />
          </>
        )}
      </Stack>
    </ZapDrawer>
  );
};

export default CustomAmountDrawer;

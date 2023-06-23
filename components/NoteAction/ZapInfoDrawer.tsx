import { Button, Stack, Text, TextInput } from "@mantine/core";
import { useRef, useState } from "react";
import ZapDrawer from "./ZapDrawer";
import { getNormalizedName } from "../../ndk/utils";
import SatsButton from "./SatsButton";
import SquareButton from "./SquareButton";
import FieldGroup from "../FieldGroups/FieldGroup";
import { CommentIcon } from "../../icons/StemstrIcon";
import { useUser } from "../../ndk/hooks/useUser";
import { useEvent } from "../../ndk/NDKEventProvider";
import useGetBtcPrice from "./useGetBtcPrice";
import SquareButtonRow from "./SquareButtonRow";

interface ZapInfoDrawerProps {
  isOpen: boolean;
  onClose: Function;
  onContinue: (satsAmount: number, comment?: string) => void;
}

const ZapInfoDrawer = ({ isOpen, onClose, onContinue }: ZapInfoDrawerProps) => {
  const { event } = useEvent();
  const user = useUser(event.pubkey);
  const btcPrice = useGetBtcPrice(isOpen);
  const defaultSatAmounts = [21, 444, 808, 5000, 10000];
  const [satsAmount, setSatsAmount] = useState(defaultSatAmounts[0]);
  const commentRef = useRef<HTMLInputElement>(null);
  const handleOnClose = () => {
    setSatsAmount(defaultSatAmounts[0]);
    onClose();
  };
  const renderSatsAmountButton = (_satsAmount: number) => (
    <SatsButton
      key={_satsAmount}
      satsAmount={_satsAmount}
      btcPrice={btcPrice}
      onClick={() => setSatsAmount(_satsAmount)}
      isHighlighted={_satsAmount === satsAmount}
    />
  );

  return (
    <ZapDrawer isOpen={isOpen} onClose={handleOnClose} size={578}>
      <Stack spacing={21}>
        <Text color="white" ta="center" size="xl" fw="bold">
          ⚡️ Send{" "}
          <Text span color="purple.6">
            sats
          </Text>{" "}
          to {getNormalizedName(event.pubkey, user)}
        </Text>
        <SquareButtonRow>
          {defaultSatAmounts.slice(0, 3).map(renderSatsAmountButton)}
        </SquareButtonRow>
        <SquareButtonRow>
          {defaultSatAmounts.slice(3).map(renderSatsAmountButton)}
          <SquareButton mainContent="Custom">...</SquareButton>
        </SquareButtonRow>
        <FieldGroup TitleIcon={CommentIcon} title="Comment" iconSize={16}>
          <TextInput ref={commentRef} placeholder="Share some zappreciation" />
        </FieldGroup>
        <Button
          mt={24}
          fullWidth
          onClick={() => onContinue(satsAmount, commentRef.current?.value)}
        >
          Continue
        </Button>
      </Stack>
    </ZapDrawer>
  );
};

export default ZapInfoDrawer;

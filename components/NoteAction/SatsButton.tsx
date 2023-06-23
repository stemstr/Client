import { type MouseEventHandler } from "react";
import SquareButton from "./SquareButton";

interface NoteActionZapButtonProps {
  onClick: MouseEventHandler;
  satsAmount: number;
  btcPrice?: number;
  isHighlighted?: boolean;
}

const SatsButton = ({
  onClick,
  satsAmount,
  btcPrice,
  isHighlighted,
}: NoteActionZapButtonProps) => {
  const getFiatAmount = () => {
    if (!btcPrice) {
      return "";
    }

    return (btcPrice / (100_000_000 / satsAmount)).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <SquareButton
      onClick={onClick}
      label={satsAmount}
      isHighlighted={isHighlighted}
    >
      {getFiatAmount()}
    </SquareButton>
  );
};

export default SatsButton;

import { useMediaQuery } from "@mantine/hooks";
import { isPwa } from "../../utils/common";
import { PWA_BOTTOM_BUFFER } from "../../constants/styles";

export default function useFooterHeight() {
  const footerHeight = useMediaQuery(`(max-width: 480px)`) ? 64 : 96;

  return isPwa() ? footerHeight + PWA_BOTTOM_BUFFER : footerHeight;
}

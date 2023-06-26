import { useEffect, useState } from "react";
import axios from "axios";

export default function useGetBtcPrice(willFetch: boolean = false) {
  const [btcPrice, setBtcPrice] = useState<number>();

  useEffect(() => {
    if (!willFetch) {
      return;
    }

    axios("https://api.kraken.com/0/public/Ticker?pair=xbtusd").then(
      ({ data }) => {
        setBtcPrice(data.result.XXBTZUSD.c[0]);
      }
    );
  }, [willFetch]);

  return btcPrice;
}

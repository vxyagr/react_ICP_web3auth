import { useQuery } from "react-query";
import { getBitCoinPrices } from "../service/btc";
import { RQ_BTC_PRICES } from "../constant/core";

function useGetBitcoinPrices() {
  const getBtcPrice = async () => {
    const res = await getBitCoinPrices();
    if (res.status === 200) {
      const priceInUsd = res.data?.data?.priceUsd || 0;
      return priceInUsd;
    }

    return 0;
  };

  return useQuery([RQ_BTC_PRICES], getBtcPrice, {
    cacheTime: 0,
    refetchInterval: 1000 * 15, // refetch getBtcPrice  every 15 seconds
  });
}

export default useGetBitcoinPrices;

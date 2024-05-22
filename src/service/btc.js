import axios from "axios";

export const getBitCoinPrices = () => {
  return axios.get(process.env.REACT_APP_BTC_PRICE_ENDPOINT);
};

import React, { useEffect, useState } from "react";
import { theme } from "antd";
import CountUp from "react-countup";
import { useMediaQuery } from "react-responsive";

import useGetBitcoinPrices from "../../hooks/useGetBitcoinPrices";

import "./style.css";

const BtcPriceInformation = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const { data: bitCoinPrices } = useGetBitcoinPrices();
  const [currentBitCoinPrices, setCurrentBitCoinPrices] = useState(0);
  const [oldBitCoinPrices, setOldBitCoinPrices] = useState(0);

  useEffect(() => {
    if (bitCoinPrices !== undefined) {
      setOldBitCoinPrices(currentBitCoinPrices);
      setCurrentBitCoinPrices(bitCoinPrices);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bitCoinPrices]);

  const {
    token: { colorPalette1 },
  } = theme.useToken();
  return (
    <div
      className="btc-price-container"
      style={{ fontSize: isDesktopOrLaptop ? "18px" : "14px" }}
    >
      <span style={{ color: "white" }}>{`BTC/USD :`}</span>
      <CountUp
        start={oldBitCoinPrices}
        end={currentBitCoinPrices}
        separator=","
        decimals={2}
        decimal="."
        prefix="$"
      >
        {({ countUpRef }) => (
          <span
            ref={countUpRef}
            style={{ color: colorPalette1, marginLeft: "3px" }}
          />
        )}
      </CountUp>
    </div>
  );
};

export default BtcPriceInformation;

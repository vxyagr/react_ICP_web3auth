import { useSetAtom } from "jotai";
import { useAtom } from "jotai";
import snakeLogo from "../assets/dragon_icon_small_.png";
import {
  isModalOpenAtom,
  isBuyModalOpenAtom,
  isClaimModalOpenAtom,
  isTransferModalOpenAtom,
  isHistoryModalOpenAtom,
  isGuideModalOpenAtom,
} from "../store/modal";
import loka_icon from "../assets/dragon_icon_.png";
import wallet_icon from "../assets/wallet.svg";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppProvider";
import { useMediaQuery } from "react-responsive";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Principal } from "@dfinity/principal";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { Layout, Row, Col, Button, theme } from "antd";
import Icon, {
  PoweroffOutlined,
  CloseOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import "./style.css";
const IconConnect = () => (
  <svg
    width="20"
    height="10"
    viewBox="0 0 20 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.25 0.833375H5.83333C3.53214 0.833375 1.66666 2.69886 1.66666 5.00004C1.66666 7.30123 3.53214 9.16671 5.83333 9.16671H7.5C9.80118 9.16671 11.6667 7.30123 11.6667 5.00004M13.75 9.16671H14.1667C16.4679 9.16671 18.3333 7.30123 18.3333 5.00004C18.3333 2.69886 16.4679 0.833374 14.1667 0.833374H12.5C10.1988 0.833374 8.33333 2.69886 8.33333 5.00004"
      stroke="white"
      stroke-width="1.66667"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default function Header() {
  const [isButtonOpen, setIsButtonOpen] = useState(false);
  const [accountId, setAccountid] = useState("");
  const toggleAccordion = () => {
    setIsButtonOpen(!isButtonOpen);
  };
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1080px)",
  });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const [collapsed, setCollapsed] = useState(false);

  const {
    loginInstance,
    setCanisterActor,
    canisterActor,
    setGameData,
    gameData,
    setUserData,
    walletAddress,
    setWalletAddress,
    userData,
    eyesLedger,
    eyesBalance,
    setEyesBalance,
    toggleMobileMenu,
    setToggleMobileMenu,
    setWalletAlias,
  } = useContext(AppContext);
  const [isBuyModalOpen, setBuyModalOpen] = useAtom(isBuyModalOpenAtom);
  const [isClaimModalOpen, setClaimModalOpen] = useAtom(isClaimModalOpenAtom);
  const [isGuideModalOpen, setGuideModalOpen] = useAtom(isGuideModalOpenAtom);
  const [isTransferModalOpen, setTransferModalOpen] = useAtom(
    isTransferModalOpenAtom
  );
  const [isHistoryModalOpen, setHistoryModalOpen] = useAtom(
    isHistoryModalOpenAtom
  );
  const [userEyes, setUserEyes] = useState(false);
  const setModalOpen = useSetAtom(isModalOpenAtom);
  const handleLogout = async () => {
    //setLoading(true);
    await loginInstance.logout();
    setCanisterActor();
    setUserData(false);
    //setGameData(false);
    setWalletAddress(false);
    setToggleMobileMenu(false);
    //setLoading(false);
  };

  const getEyesBalance = async () => {
    var acc = {
      owner: Principal.fromText(walletAddress),
      subaccount: [],
    };
    var balance_ = await eyesLedger.icrc1_balance_of(acc);
    var n_ = Number(balance_) / 100000000;
    n_ = parseFloat(n_).toLocaleString();
    setEyesBalance(n_);
  };

  useEffect(() => {
    if (walletAddress && eyesLedger) {
      var acc = {
        principal: Principal.fromText(walletAddress),
        subaccount: [],
      };
      var accid = AccountIdentifier.fromPrincipal(acc);

      setAccountid(accid.toHex());
      getEyesBalance();
    }
  }, [eyesLedger, walletAddress]);

  return <nav className="grid w-full z-99999 "></nav>;
}

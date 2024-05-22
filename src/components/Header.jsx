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

export default function Header() {
  const [accountId, setAccountid] = useState("");

  const {
    loginInstance,
    setCanisterActor,

    setUserData,
    walletAddress,
    setWalletAddress,

    eyesLedger,

    setEyesBalance,

    setToggleMobileMenu,
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

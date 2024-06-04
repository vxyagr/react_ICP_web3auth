import React from "react";

import { useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Row, Col, Typography, Button } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import LokaBackground from "../../assets/image/loka_bg.png";
import Header from "../../components/Header";
import GameModal from "../../components/GameModal";
import HistoryModal from "../../components/HistoryModal";

import ConnectModal from "../../components/ConnectModal";
import { AppContext } from "../../context/AppProvider";
import confetti from "canvas-confetti";
import "./style.css";
import { useEffect, useState, useContext } from "react";
import { FaTwitter } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import {
  isGameModalOpenAtom,
  isModalOpenAtom,
  isBuyModalOpenAtom,
  isGuideModalOpenAtom,
} from "../../store/modal";
import {
  actorCreation,
  getUserPrincipal,
} from "../../service/icdragoncanister";
import BuyTicketModal from "../../components/BuyTicketModal";
import ClaimModal from "../../components/ClaimModal";
import TransferModal from "../../components/TransferModal";
import GuideModal from "../../components/GuideModal";
const { Title } = Typography;

const Landing = () => {
  const setModalOpen = useSetAtom(isGameModalOpenAtom);
  const setConnectOpen = useSetAtom(isModalOpenAtom);
  const setBuyOpen = useSetAtom(isBuyModalOpenAtom);
  const setGuideOpen = useSetAtom(isGuideModalOpenAtom);
  const generalPrivKey =
    "0bc9866cbc181a4f5291476f7be00ca4f11cae6787e10ed9dc1d40db7943f643";

  const [num, setNum] = useState(250);
  const {
    loginInstance,
    canisterActor,
    setCanisterActor,
    gameData,
    userData,
    ticketPrice,
    setGameData,
    setTicketPrice,
    walletAddress,
    setWalletAddress,
    setUserData,
    walletAlias,
  } = useContext(AppContext);
  const [connected, setConnected] = useState(false);

  const getUserDatas = async () => {
    //const actor = actorCreation(loginInstance.privKey);
    //const actor = actorCreation(generalPrivKey);
  };

  const getGameDatas = async () => {
    const actor = actorCreation(generalPrivKey);
    let game_ = await actor.getCurrentGame();
    var principalString_ = getUserPrincipal(generalPrivKey).toString();

    let ticket_ = await actor.getTicketPrice();

    setTicketPrice(ticket_);
    setGameData(game_);
  };
  useEffect(() => {
    //console.log(gameData);
    const actor_ = actorCreation(generalPrivKey);
    gameData ? setNum(Number(gameData.ok.reward) / 100000000) : setNum(0);
    loginInstance && loginInstance.privKey && userData
      ? setConnected(true)
      : setConnected(false);
  }, [loginInstance, userData, gameData, generalPrivKey]);
  useEffect(() => {
    getGameDatas();
  }, [generalPrivKey]);

  useEffect(() => {
    if (connected) {
      getUserDatas();
    }
  }, [connected]);

  const handleLogout = async () => {
    //setLoading(true);
    await loginInstance.logout();
    setCanisterActor();
    setUserData(false);
    //setGameData(false);
    setWalletAddress(false);

    //  closeModal();
    //setLoading(false);
  };

  return (
    <div className="landing-container h-screen">
      <Header className="z-999999" />

      {!walletAddress ? (
        <button
          onClick={() => {
            setConnectOpen(true);
          }}
          className="w-full  text-2xl  px-6 py-3 font-passion text-warm-white rounded-lg bg-[#EE5151] "
        >
          Connect Wallet to Play
        </button>
      ) : (
        <button
          onClick={() => {
            handleLogout();
          }}
          className="w-full  text-2xl  px-6 py-3 font-passion text-warm-white rounded-lg bg-[#EE5151] "
        >
          Disconnect
        </button>
      )}
      {walletAddress ? "wallet address : " + walletAddress : ""}
      <br />
      {walletAddress ? "game data : " + gameData.toString() : ""}

      <ConnectModal className="z-70" />
      <GameModal className="z-70" />
      <BuyTicketModal className="z-70" />
      <ClaimModal className="z-70" />
      <TransferModal className="z-70" />
      <HistoryModal className="z-70" />
      <GuideModal className="z-70" />
    </div>
  );
};

export default Landing;

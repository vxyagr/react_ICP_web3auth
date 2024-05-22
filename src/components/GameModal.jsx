import { useAtom } from "jotai";
import { isGameModalOpenAtom } from "../store/modal";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import OpenLogin from "@toruslabs/openlogin";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getUserPrincipal } from "../service/icdragoncanister";
import { Principal } from "@dfinity/principal";
import confetti from "canvas-confetti";
import dice from "../assets/dice_gif.gif";
import dicegif2 from "../assets/dice_gif2.gif";
import dice_1 from "../assets/dice_number/1.png";
import dice_2 from "../assets/dice_number/2.png";
import dice_3 from "../assets/dice_number/3.png";
import dice_4 from "../assets/dice_number/4.png";
import dice_5 from "../assets/dice_number/5.png";
import dice_6 from "../assets/dice_number/6.png";
import Icon, {
  PoweroffOutlined,
  CloseOutlined,
  GoogleOutlined,
} from "@ant-design/icons";

import { actorCreation } from "../service/icdragoncanister";

import { AppContext } from "../context/AppProvider";

import { Button, Modal, message } from "antd";

export default function GameModal() {
  const dice_image = [dice_1, dice_1, dice_2, dice_3, dice_4, dice_5, dice_6];
  const [isGameModalOpen, setModalOpen] = useAtom(isGameModalOpenAtom);
  const { t } = useTranslation();
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(2);
  const [lose, setLose] = useState(false);
  const [win, setWin] = useState(false);
  const [highest, setHighest] = useState(false);
  const [absoluteHighest, setAbsoluteHighest] = useState(false);
  const [highestExtra, setHighestExtra] = useState(false);
  const [legend, setLegend] = useState(false);
  const [isextra, setIsExtra] = useState(false);
  const {
    loginInstance,
    setCanisterActor,
    setUserData,
    gameData,
    setGameData,
    userData,
    canisterActor,
    eyesLedger,
    setEyesBalance,
    walletAddress,
  } = useContext(AppContext);

  const closeModal = () => {
    setWin(false);
    setLose(false);
    setModalOpen(false);
  };

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (win || legend || absoluteHighest) launchConfetti();
    loginInstance && loginInstance.privKey && userData
      ? setConnected(true)
      : setConnected(false);
  }, [loginInstance, userData, gameData, win]);

  const handleroll = async () => {
    setWin(false);
    setLose(false);
    setIsExtra(false);
    setAbsoluteHighest(false);
    setHighest(false);
    setHighestExtra(false);
    setLegend(false);
    //console.log("rolling....");
    if (connected && userData) {
      if (userData.availableDiceRoll <= 0) {
        closeModal();
        return;
      }
    }
    //console.log("rolling 2....");

    var privKey = loginInstance.privKey;
    setLoading(true);
    if (!privKey) {
      throw new Error("failed login");
    }

    const dragonAgent_ = canisterActor;

    //console.log("rolling 3....");
    var roll = await dragonAgent_.roll_dice(Number(gameData.ok.id));
    //console.log("rolling 4....");
    //console.log(roll);
    if (roll.noroll) {
      //console.log("no roll");
      setLoading(false);
      return;
    }
    if (roll.lose) {
      setLose(true);
      setDice1(roll.lose[0]);
      setDice2(roll.lose[1]);
      //console.log(roll.lose[0]);
      //console.log(roll.lose[1]);
    } else if (roll.win) {
      setDice1(1);
      setDice2(1);
      setWin(true);
    } else if (roll.extra) {
      setIsExtra(true);
      setDice1(roll.extra[0]);
      setDice2(roll.extra[1]);
      //console.log(roll.extra[0]);
      //console.log(roll.extra[1]);
    } else if (roll.highest) {
      setHighest(true);
      setDice1(roll.highest[0]);
      setDice2(roll.highest[1]);
    } else if (roll.absoluteHighest) {
      setAbsoluteHighest(true);
      setDice1(6);
      setDice2(6);
    } else if (roll.highestExtra) {
      setHighestExtra(true);
      setDice1(roll.highestExtra[0]);
      setDice2(roll.highestExtra[1]);
    } else if (roll.legend) {
      setDice1(1);
      setDice2(1);
      setLegend(true);
    }

    setLoading(false);
    var user_ = await dragonAgent_.getUserData();
    var acc = {
      owner: Principal.fromText(walletAddress),
      subaccount: [],
    };
    var balance_ = await eyesLedger.icrc1_balance_of(acc);
    setEyesBalance(Number(balance_) / 100000000);

    var game_ = await dragonAgent_.getCurrentGame();

    setUserData(user_);
    setGameData(game_);
  };

  const launchConfetti = () => {
    let count = 0;
    const intervalId = setInterval(() => {
      if (count >= 5) {
        clearInterval(intervalId);
        return;
      }

      confetti({
        angle: 90,
        spread: 360,
        startVelocity: 40,
        elementCount: 200,
        dragFriction: 0.12,
        duration: 3000,
        stagger: 3,
        width: "10px",
        height: "10px",
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
      });

      count++;
    }, 500);
  };

  return <></>;
}

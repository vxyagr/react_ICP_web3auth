import { useAtom } from "jotai";
import { isBuyModalOpenAtom } from "../store/modal";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
//import { faMinus, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Fragment } from "react";
import OpenLogin from "@toruslabs/openlogin";
import QRCode from "qrcode.react";
import { useTranslation } from "react-i18next";
import { getUserPrincipal } from "../service/icdragoncanister";
import { icpAgent } from "../service/icpledgercanister";
import { Principal } from "@dfinity/principal";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import Icon, {
  PoweroffOutlined,
  CloseOutlined,
  GoogleOutlined,
} from "@ant-design/icons";

import { actorCreation } from "../service/icdragoncanister";

import { AppContext } from "../context/AppProvider";

import { Button, Modal, message } from "antd";

export default function BuyTicketModal() {
  const [isBuyModalOpen, setModalOpen] = useAtom(isBuyModalOpenAtom);
  const { t } = useTranslation();
  const [buying, setBuying] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const {
    loginInstance,
    canisterActor,
    setUserData,
    userData,
    ticketPrice,
    gameData,
    icpAgent,
    walletAddress,
    setToggleMobileMenu,
  } = useContext(AppContext);
  const [ticketQuantity, setticketQuantity] = useState(10);
  const [accountId, setAccountid] = useState("");
  useEffect(() => {
    if (walletAddress) {
      var acc = {
        principal: Principal.fromText(walletAddress),
        subaccount: [],
      };
      var accid = AccountIdentifier.fromPrincipal(acc);
      //console.log(accid.toHex(), "<<<<<<<<<< Acc Id");
      setAccountid(accid.toHex());
    }
  }, [walletAddress]);
  useEffect(() => {}, [loginInstance]);
  const handleMinusClick = () => {
    const newValue = Math.max(ticketQuantity - 1, 1); // Ensure the value is at least 100
    setticketQuantity(newValue);
    //dispatch(changeInvestment(newValue));
  };
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    //setUserBalance(1000000000000000);
    //return;
    if (walletAddress && icpAgent) var b = getUserBalance();
    loginInstance && loginInstance.privKey && userData
      ? setConnected(true)
      : setConnected(false);
  }, [loginInstance, userData, gameData, icpAgent]);
  const handlePlusClick = () => {
    var newValue = ticketQuantity + 1;

    //dispatch(changeInvestment(newValue));
    setticketQuantity(newValue);
  };

  const handleInputChange = (event) => {
    const newValue = Math.max(Number(event.target.value), 1); // Ensure the value is at least 100
    //dispatch(changeInvestment(newValue));
    setticketQuantity(newValue);
  };

  useEffect(() => {
    //dispatch(changeInvestment(ticketQuantity));
  }, [ticketQuantity]);
  const closeModal = () => {
    setModalOpen(false);
  };

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    if (!loading) {
      setShowModal(false);
    }
  };

  const getUserBalance = async () => {
    //console.log("get user balance addr " + walletAddress);
    //console.log(icpAgent);
    var acc = {
      owner: Principal.fromText(walletAddress),
      subaccount: [],
    };
    var balance_ = await icpAgent.icrc1_balance_of(acc);
    setUserBalance(Number(balance_) / 100000000);
    return Number(balance_);
  };

  const handlebuy = async () => {
    setBuying(true);
    var privKey = loginInstance.privKey;

    if (!privKey) {
      throw new Error("failed login");
    }

    const dragonAgent_ = canisterActor;
    const icpAgent_ = icpAgent;

    var acc = {
      owner: Principal.fromText(walletAddress),
      subaccount: [],
    };

    var icDragonSmartContract = {
      owner: Principal.fromText(process.env.REACT_APP_CANISTER_ID),
      subaccount: [],
    };
    let price_ = Number(ticketPrice);

    var approve_ = {
      fee: [],
      memo: [],
      from_subaccount: [],
      created_at_time: [],
      amount: 10 * ticketQuantity * price_ + 10000,
      expected_allowance: [],
      expires_at: [],
      spender: icDragonSmartContract,
    };

    const allow_ = {
      account: acc,
      spender: icDragonSmartContract,
    };

    //var balance_ = await icpAgent_.icrc1_balance_of(acc);
    //var balancesc_ = await icpAgent_.icrc1_balance_of(icDragonSmartContract);
    var approval = await icpAgent_.icrc2_approve(approve_);
    //console.log(approval);
    //var allowance_ = await icpAgent_.icrc2_allowance(allow_);
    //return;
    // var userData_ = await actor.getUserData();
    //console.log("balance user ");
    /*
    console.log(balance_);
    console.log("balance SC ");
    console.log(balancesc_);
    console.log("approve ");
    console.log(approval);
    console.log("allowance ");
    console.log(allowance_); */

    //console.log("price " + price_);
    var buy_ticket = await dragonAgent_.buy_ticket(
      ticketQuantity,
      price_,
      ticketQuantity * price_
    );
    console.log(buy_ticket);
    var user_ = await dragonAgent_.getUserData();
    //balancesc_ = await icpAgent_.icrc1_balance_of(icDragonSmartContract);
    //console.log("balance SC after ");
    //console.log(balancesc_);
    setUserData(user_);
    setBuying(false);
    setShowModal(false);
  };
  function truncateString(str, num) {
    if (!str) return "";
    if (str.length <= num) {
      return str;
    }
    const frontChars = Math.ceil(num / 2);
    const backChars = Math.floor(num / 2);
    return (
      str.substr(0, frontChars) + "..." + str.substr(str.length - backChars)
    );
  }

  function copyToClipboard() {
    //const textToCopy = walletAddress; // Replace with your actual string variable
    const textToCopy = accountId;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Wallet address copied to clipboard");
      })
      .catch((err) => {
        console.error("Error in copying text: ", err);
      });
  }

  return <></>;
}

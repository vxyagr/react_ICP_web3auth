import { useAtom } from "jotai";
import { isClaimModalOpenAtom } from "../store/modal";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
//import { faMinus, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Fragment } from "react";
import OpenLogin from "@toruslabs/openlogin";

import { useTranslation } from "react-i18next";
import { getUserPrincipal } from "../service/icdragoncanister";
//import { icpAgent } from "../service/icpledgercanister";
import { Principal } from "@dfinity/principal";
import Icon, {
  PoweroffOutlined,
  CloseOutlined,
  GoogleOutlined,
} from "@ant-design/icons";

import { actorCreation } from "../service/icdragoncanister";

import { AppContext } from "../context/AppProvider";

import { Button, Modal, message } from "antd";

export default function ClaimModal() {
  const [isClaimModalOpen, setModalOpen] = useAtom(isClaimModalOpenAtom);
  const { t } = useTranslation();
  const [buying, setBuying] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [claiming, setClaiming] = useState(false);
  const [claimingBonus, setClaimingBonus] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [transferAddress, setTransferAddress] = useState("");
  const {
    loginInstance,
    canisterActor,
    setUserData,
    userData,
    ticketPrice,
    gameData,
    icpAgent,
    walletAddress,
  } = useContext(AppContext);
  const [ticketQuantity, setticketQuantity] = useState(10);
  const [targetAddress, setTargetAddress] = useState("");
  const [claimable, setClaimable] = useState(false);
  const [claimableB, setClaimableB] = useState(false);
  useEffect(() => {}, [loginInstance]);
  const handleMinusClick = () => {
    const newValue = Math.max(ticketQuantity - 1, 1); // Ensure the value is at least 100
    setticketQuantity(newValue);
    //dispatch(changeInvestment(newValue));
  };
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (walletAddress && icpAgent) var b = getUserBalance();
    //console.log("user data");
    // console.log(userData)
    if (userData) {
      if (Number(userData.claimableBonus) > 0) setClaimableB(true);
      else setClaimableB(false);
      if (Number(userData.claimableReward) > 0) setClaimable(true);
      else setClaimable(false);
    } else {
      setClaimable(false);
      setClaimableB(false);
    }
    loginInstance && loginInstance.privKey && userData
      ? setConnected(true)
      : setConnected(false);
  }, [loginInstance, userData, gameData, userBalance]);
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

  const handleAddressInputChange = (event) => {
    const newValue = event.target.value;
    //dispatch(changeInvestment(newValue));
    setTargetAddress(newValue);
    //console.log("hexstring ");
    //console.log(hexStringToByteArray(newValue));
  };

  function hexStringToByteArray(str) {
    let result = "";
    for (let i = 0; i < str.length; i += 2) {
      result += str.substring(i, i + 2);
      if (i + 2 < str.length) {
        result += "\\";
      }
    }
    return result;
  }

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
    //console.log("addr get balance " + walletAddress);
    //console.log(icpAgent);
    var acc = {
      owner: Principal.fromText(walletAddress),
      subaccount: [],
    };
    var balance_ = await icpAgent.icrc1_balance_of(acc);
    setUserBalance(Number(balance_) / 100000000);
    return Number(balance_);
  };

  const checkAddressType = (address_) => {
    //console.log("checking " + targetAddress);
    // Regular expressions for matching the two formats
    // Regular expression for Type 1 Address (64-character hexadecimal)
    const type1Regex = /^[a-f0-9]{64}$/i;

    // Regular expression for Type 2 Address
    // Adjust the group lengths as per the specific requirements of your address format
    const type2Regex =
      /^[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{3}$/i;

    const type3Regex =
      /^[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{3}$/i; // New Type: Example format like "s4bfy-iaaaa-aaaam-ab4qa-cai"
    if (type1Regex.test(targetAddress)) {
      //console.log("address account");
      return 1;
    } else if (type2Regex.test(targetAddress)) {
      //console.log("address principal");
      return 2;
    } else if (type3Regex.text(targetAddress)) {
      //console.log("address principal contract");
      return 2;
    } else {
      return 0;
    }
  };

  const handleclaim = async () => {
    setClaiming(true);
    //console.log("claiming");
    let res = await canisterActor.claimReward();
    //console.log("claim result");
    //console.log(res);
    var user_ = await canisterActor.getUserData();
    setUserData(user_);
    setClaiming(false);
  };

  const handleclaimBonus = async () => {
    setClaimingBonus(true);
    //console.log("claiming");
    let res = await canisterActor.claimBonusPool();
    //console.log("claim result");
    //console.log(res);
    var user_ = await canisterActor.getUserData();
    setUserData(user_);
    setClaimingBonus(false);
  };

  const handletransfer = async () => {
    var transferrableAmount = 0;
    //console.log("user balance ");
    let oriUserBalance = Number(userBalance) * 100000000;
    //console.log("user balance " + oriUserBalance < 10000);
    if (oriUserBalance < 10000) return false;
    transferrableAmount = oriUserBalance - 10000;
    setTransferring(true);
    var type_ = checkAddressType(targetAddress);
    //console.log("result check type " + type_);
    var transferResult_ = null;
    if (type_ == 1) {
      //console.log("hex ");
      //console.log(hexStringToByteArray(targetAddress));
      /*

      {
    to: IDL.Vec(IDL.Nat8),
    fee: Tokens,
    memo: IDL.Nat64,
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(TimeStamp),
    amount: Tokens,
  }
      */
      const hexString = targetAddress;
      const to_ = hexString.match(/.{1,2}/g).map((hex) => parseInt(hex, 16));
      let transferArgs_ = {
        //to: hexStringToByteArray(targetAddress),
        to: to_,
        fee: { e8s: 10000 },
        memo: 1,
        from_subaccount: [],
        created_at_time: [],
        amount: { e8s: transferrableAmount },
      };
      transferResult_ = await icpAgent.transfer(transferArgs_);
      //console.log("transfer to account");
      //console.log(transferResult_);
    } else if (type_ == 2) {
      /*
      {
    to: Account,
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
    amount: IDL.Nat,
  }
      */
      var acc = {
        owner: Principal.fromText(targetAddress),
        subaccount: [],
      };
      let transferArgs2_ = {
        to: acc,
        fee: [10000],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount: transferrableAmount,
      };
      transferResult_ = await icpAgent.icrc1_transfer(transferArgs2_);
      //console.log("transfer to principal ");
      //console.log(transferResult_);
    } else {
      console.log("address invalid");
    }
    setTransferring(false);
    var newUserData = await icpAgent.getUserBalance();
  };
  return <></>;
}

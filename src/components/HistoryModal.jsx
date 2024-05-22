import { useAtom } from "jotai";
import { isHistoryModalOpenAtom } from "../store/modal";
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
import { AccountIdentifier } from "@dfinity/ledger-icp";
import Icon, {
  PoweroffOutlined,
  CloseOutlined,
  GoogleOutlined,
} from "@ant-design/icons";

import { actorCreation } from "../service/icdragoncanister";

import { AppContext } from "../context/AppProvider";

import { Button, Modal, message } from "antd";

export default function HistoryModal() {
  const [isHistoryModalOpen, setModalOpen] = useAtom(isHistoryModalOpenAtom);
  const { t } = useTranslation();
  const [buying, setBuying] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [claiming, setClaiming] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [gameTab, setGameTab] = useState(true);
  const [betTab, setBetTab] = useState(false);
  const [claimTab, setClaimTab] = useState(false);

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
  useEffect(() => {}, [loginInstance]);
  const handleMinusClick = () => {
    const newValue = Math.max(ticketQuantity - 1, 1); // Ensure the value is at least 100
    setticketQuantity(newValue);
    //dispatch(changeInvestment(newValue));
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
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Success handling (optional)
        alert(`Copied: ${text}`);
      })
      .catch((err) => {
        // Error handling (optional)
        console.error("Failed to copy: ", err);
      });
  };
  //

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() returns 0-11
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  const [connected, setConnected] = useState(false);
  const [bets, setBets] = useState([]);
  const [userBets, setUserBets] = useState([]);
  const [userClaims, setUserClaims] = useState([]);
  useEffect(() => {
    if (walletAddress && icpAgent) var b = getUserBalance();
    if (gameData) setBets(gameData.ok.bets);
    if (userData) {
      setUserBets(userData.gameHistory);
      setUserClaims(userData.claimHistory);
    }
    //console.log("user data");
    // console.log(userData)
    if (userData) {
      if (Number(userData.claimableReward) > 0) setClaimable(true);
      else setClaimable(false);
    } else {
      setClaimable(false);
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

  const rebaseTab = () => {
    setClaimTab(false);
    setGameTab(false);
    setBetTab(false);
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

  const handleClaimTab = () => {
    rebaseTab();
    setClaimTab(true);
  };
  const handleGameTab = () => {
    rebaseTab();
    setGameTab(true);
  };
  const handleBetTab = () => {
    rebaseTab();
    setBetTab(true);
  };

  const getUserBalance = async () => {
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
  //const columnHeaders = {Object.keys(data[0])};

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
      //console.log("address invalid");
    }
    setTransferring(false);
    var newUserData = await icpAgent.getUserBalance();
  };

  const wta = (str) => {
    var acc = {
      principal: Principal.fromText(str),
      subaccount: [],
    };
    var accid = AccountIdentifier.fromPrincipal(acc);
    accid = accid.toHex();
    //console.log(accid, "<<<<<<<<<<<<<<<<<< accid");
    return accid;
  };
  return (
    <Transition appear show={isHistoryModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 w-full h-full"
        onClose={closeModal}
      >
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed h-full inset-0 bg-black/35 w-screen" />
        </Transition.Child>

        <div className="fixed h-full inset-0  w-screen">
          <div className="flex h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* Main modal */}
              <Dialog.Panel className="w-full h-[80%]  transform overflow-hidden rounded-2xl bg-warm-white p-2 text-left align-middle shadow-xl transition-all relative">
                <Dialog.Title
                  as="h3"
                  className="text-xl  lg:text-2xl font-passion leading-6 text-gray-900 items-center text-center"
                >
                  Stats
                </Dialog.Title>
                <div className="grid w-full text-center justify-center items-center">
                  <div className="p-2 font-passion flex items-center justify-center text-left lg:text-xl text-base w-full text-dark-blue ">
                    {" "}
                    Reward Distributed :{" "}
                    <span className="text-red-500 text-lg lg:text-2xl px-1">
                      {gameData ? (
                        parseFloat(
                          (Number(gameData.ok.totalReward) / 100000000).toFixed(
                            1
                          )
                        ).toLocaleString()
                      ) : (
                        <></>
                      )}{" "}
                      ICP
                    </span>
                  </div>
                  <div className="p-2 py-1 flex items-center justify-between text-left text-sm lg:w-[700px] w-full text-warm-white bg-dark-blue bg-opacity-90 rounded-xl  px-6 ">
                    <div className="grid items-center text-center justify-center p-2">
                      <div className="lg:text-lg">Rounds</div>
                      <div className="text-lg lg:text-2xl  text-warm-white font-passion">
                        {" "}
                        {gameData ? Number(gameData.ok.id) - 1 : <></>}
                      </div>
                    </div>
                    <div className="grid items-center text-center justify-center px-2">
                      <div className="lg:text-lg">Highest Reward</div>
                      <div className="text-lg lg:text-2xl text-warm-white font-passion">
                        {gameData ? (
                          (
                            Number(gameData.ok.highestReward) / 100000000
                          ).toFixed(1)
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className="grid items-center text-center justify-center px-2">
                      <div className="lg:text-lg">Unique Users</div>
                      <div className="text-lg lg:text-2xl text-warm-white font-passion">
                        {" "}
                        {gameData ? Number(gameData.ok.users) : <></>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid w-full text-center justify-center items-center lg:text-xl text-sm pt-2">
                  <div className=" py-1 flex items-center justify-between text-left  lg:w-[700px] w-full text-warm-white  rounded-xl    ">
                    {gameTab ? (
                      <div className="bg-dark-blue bg-opacity-90 font-passion cursor-pointer rounded-xl px-3 py-1 text-white">
                        {" "}
                        Current Game
                      </div>
                    ) : (
                      <div
                        className="bg-gray-400 cursor-pointer font-passion rounded-xl px-3 py-1  "
                        onClick={handleGameTab}
                      >
                        {" "}
                        Current Game
                      </div>
                    )}
                    {betTab ? (
                      <div className="bg-dark-blue bg-opacity-90 mx-3 font-passion cursor-pointer rounded-xl px-3 py-1 text-white">
                        {" "}
                        Your Bets
                      </div>
                    ) : (
                      <div
                        className=" bg-gray-400 cursor-pointer mx-3 font-passion rounded-xl px-3 py-1"
                        onClick={handleBetTab}
                      >
                        {" "}
                        Your Bets
                      </div>
                    )}
                    {claimTab ? (
                      <div className="bg-dark-blue bg-opacity-90 font-passion cursor-pointer rounded-xl px-3 py-1 text-white">
                        {" "}
                        Your Claims
                      </div>
                    ) : (
                      <div
                        className="bg-gray-400 cursor-pointer font-passion rounded-xl px-3 py-1 "
                        onClick={handleClaimTab}
                      >
                        {" "}
                        Your Claims
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-2 h-[60%] max-h-1/2 overflow-scroll  bg-dashboard-blue p-4 border  my-5 text-sm   text-gray-500">
                  <div className="flex flex-col   max-h-[80%]  items-stretch w-full p-0 ">
                    {gameTab ? (
                      <table className="w-full rounded-xl bg-white ">
                        <thead>
                          <tr>
                            <th className="text-center py-2 px-4 bg-gray-200 border">
                              id
                            </th>
                            <th className="text-center py-2 px-4 bg-gray-200 border">
                              time
                            </th>
                            <th className="text-center py-2 px-4 bg-gray-200 border">
                              wallet
                            </th>
                            <th className="text-center py-2 px-4 bg-gray-200 border">
                              dice#1
                            </th>
                            <th className="text-center py-2 px-4 bg-gray-200 border">
                              dice#2
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {bets.map((row, index) => (
                            <tr key={index} className="text-left px-2 border-b">
                              <td className="text-center">
                                {Number(row.id).toString()}
                              </td>
                              <td className="p-2 text-center">
                                {formatTimestamp(Number(row.time) / 1000000)}
                              </td>
                              <td
                                className="cursor-pointer text-center"
                                onClick={() =>
                                  copyToClipboard(row.walletAddress.toString())
                                }
                              >
                                {truncateString(
                                  wta(row.walletAddress.toString()),
                                  10
                                )}
                              </td>
                              <td className="px-2 text-center">
                                {Number(row.dice_1).toString()}
                              </td>
                              <td className="px-2 text-center">
                                {Number(row.dice_2).toString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <></>
                    )}

                    {betTab ? (
                      <table className="min-w-full bg-white ">
                        <thead>
                          <tr>
                            <th className="py-2 px-4 text-center bg-gray-200 border">
                              id
                            </th>
                            <th className="py-2 px-4 text-center bg-gray-200 border">
                              time
                            </th>

                            <th className="py-2 px-4 text-center bg-gray-200 border">
                              dice#1
                            </th>
                            <th className="py-2 px-4 text-center bg-gray-200 border">
                              dice#2
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {userBets.map((row, index) => (
                            <tr
                              key={index}
                              className="text-center px-2 border-b"
                            >
                              <td className="text-center">
                                {Number(row.id).toString()}
                              </td>
                              <td className="p-2 text-center">
                                {formatTimestamp(Number(row.time) / 1000000)}
                              </td>

                              <td className="px-2 text-center">
                                {Number(row.dice_1).toString()}
                              </td>
                              <td className="px-2 text-center">
                                {Number(row.dice_2).toString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <></>
                    )}
                    {claimTab ? (
                      <table className="min-w-full bg-white ">
                        <thead>
                          <tr>
                            <th className="py-2 text-center px-4 bg-gray-200 border">
                              Time
                            </th>
                            <th className="py-2 text-center px-4 bg-gray-200 border">
                              ICP Transfer Hash
                            </th>
                            <th className="py-2 text-center px-4 bg-gray-200 border">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {userClaims.map((row, index) => (
                            <tr
                              key={index}
                              className="text-center px-2 border-b"
                            >
                              <td className="text-center">
                                {formatTimestamp(Number(row.time) / 1000000)}
                              </td>
                              <td className="p-2 text-center">
                                {Number(row.icp_transfer_index)}
                              </td>
                              <td className="text-center">
                                {Number(row.reward_claimed) / 100000000}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                <div className="mt-4"></div>

                {/* Close button */}
                <button
                  type="button"
                  className="absolute top-6 right-6 rounded-full"
                  onClick={closeModal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

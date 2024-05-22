import { useAtom } from "jotai";
import { isTransferModalOpenAtom } from "../store/modal";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import pemfile from "pem-file";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { fromHexString } from "@dfinity/candid/lib/cjs/utils/buffer";
//import { faMinus, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Fragment } from "react";
import OpenLogin from "@toruslabs/openlogin";
import QRCode from "qrcode.react";

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
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
export default function TransferModal() {
  const [isTransferModalOpen, setModalOpen] = useAtom(isTransferModalOpenAtom);
  const { t } = useTranslation();
  const [buying, setBuying] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [claiming, setClaiming] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [transferError, setTransferError] = useState(false);
  const [depositTab, setDepositTab] = useState(true);
  const [transferTab, setTransferTab] = useState(false);
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
    setCanisterActor,
    setWalletAddress,
    setToggleMobileMenu,
    eyesLedger,
    setEyesBalance,
    eyesBalance,
    setCurrentEmail,
    currentEmail,
  } = useContext(AppContext);
  const [accountId, setAccountid] = useState("");
  const [ticketQuantity, setticketQuantity] = useState(10);
  const [targetAddress, setTargetAddress] = useState("");
  const [claimable, setClaimable] = useState(false);
  useEffect(() => {}, [loginInstance]);
  const handleMinusClick = () => {
    const newValue = Math.max(ticketQuantity - 1, 1); // Ensure the value is at least 100
    setticketQuantity(newValue);
    //dispatch(changeInvestment(newValue));
  };

  const DFX_PEM_BEGIN = "-----BEGIN PRIVATE KEY-----";
  const DFX_PEM_END = "-----END PRIVATE KEY-----";

  const PEM_BEGIN = "-----BEGIN PRIVATE KEY-----";

  const PEM_END = "-----END PRIVATE KEY-----";

  const PRIV_KEY_INIT =
    "308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420";

  const KEY_SEPARATOR = "a144034200";

  function getPem(priv) {
    var rawPrivateKey = priv;
    var rawPublicKey = accountId;

    return `${PEM_BEGIN}\n${Buffer.concat
      .from(
        `${PRIV_KEY_INIT}${rawPrivateKey}${KEY_SEPARATOR}${rawPublicKey}`,
        "hex"
      )
      .toString("base64")}\n${PEM_END}`;
  }

  const createPem = (str) => {
    var pri_ = fromHexString(str);
    var pub_ = fromHexString(accountId);
    var userIdentity = Secp256k1KeyIdentity.fromSecretKey(fromHexString(str));
    var pb = userIdentity.getKeyPair().publicKey;
    console.log(pb, "<<< secp");
    var id_ = Ed25519KeyIdentity.fromSecretKey(pri_);
    const [publicKey, privateKey] = id_.toJSON();
    console.log(fromHexString(publicKey), "pubkey");
    //var publicKey = accountId;
    //var privateKey = str;
    // From Dfinity ic:
    // https://github.com/dfinity/ic/blob/master/rs/crypto/utils/basic_sig/src/conversions.rs#L117

    // prettier-ignore
    const der = Buffer.concat([
    Buffer.from([
      0x30, 83, // A sequence of 83 bytes follows.
      2, 1, // An integer denoting version
      0, // 0 if secret key only, 1 if public key is also present
      48, 5, // An element of 5 bytes follows
      6, 3, 43, 101, 112, // The OID
      4, 34, // An octet string of 34 bytes follows.
      4, 32, // An octet string
    ]),
    Buffer.from(privateKey.slice(0, 64), 'hex'),
    Buffer.from([
      161, 35, // An explicitly tagged with 35 bytes.
      3, 33, // A bitstring of 33 bytes follows.
      0,  // The bitstring (32 bytes) is divisible by 8
    ]),
    Buffer.from(privateKey.slice(64), 'hex')
    ]);
    //var res = pemfile.encode(Buffer.from(str), "DATA");
    //return res;
    var res = pemfile.encode(der, "DATA");
    return res;
    //return `${DFX_PEM_BEGIN}\n${der.toString("base64")}\n${DFX_PEM_END}`;
  };

  const rebaseTab = () => {
    setDepositTab(false);
    setTransferTab(false);
    setShowKey(false);
    setCurrentPriv(false);
    //setBetTab(false);
  };
  const handleDepositTab = () => {
    rebaseTab();
    setDepositTab(true);
  };
  const handleTransferTab = () => {
    rebaseTab();
    setTransferTab(true);
  };

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
  const [connected, setConnected] = useState(false);

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

  useEffect(() => {
    if (walletAddress && icpAgent) var b = getUserBalance();
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

  // Copy to Clipboard Function
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

  function copyPriv() {
    //const textToCopy = walletAddress; // Replace with your actual string variable
    const textToCopy = currentPriv;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Wallet address copied to clipboard");
      })
      .catch((err) => {
        console.error("Error in copying text: ", err);
      });
  }

  function copyToClipboardW() {
    const textToCopy = walletAddress; // Replace with your actual string variable
    // textToCopy = accountId;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Principal copied to clipboard");
      })
      .catch((err) => {
        console.error("Error in copying text: ", err);
      });
  }

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

  const getUserBalance = async () => {
    var acc = {
      owner: Principal.fromText(walletAddress),
      subaccount: [],
    };
    var balance_ = await icpAgent.icrc1_balance_of(acc);
    var eyes_ = await eyesLedger.icrc1_balance_of(acc);
    var n_ = parseFloat(Number(eyes_) / 100000000).toLocaleString();
    setEyesBalance(n_);
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

  const handleLogout = async () => {
    //setLoading(true);
    await loginInstance.logout();
    setCanisterActor();
    setUserData(false);
    //setGameData(false);
    setWalletAddress(false);
    setToggleMobileMenu(false);
    setShowModal(false);
    closeModal();
    //setLoading(false);
  };
  const [currentPriv, setCurrentPriv] = useState(false);
  const [showkey, setShowKey] = useState(false);
  async function showPrivKey() {
    //var a = await handleLogout();
    // var b = await handleLogin();
    setLoading(true);
    try {
      const { privKey } = await loginInstance.login({
        loginProvider: "google",
        redirectUrl: `${window.origin}`,
      });

      if (!privKey) {
        throw new Error("failed login");
      }
      //var privKey =
      //"1707ebb3ffd10a3530245e9a192a2e6fa03a55454052b970d3e2248302b9da02";
      setCurrentPriv(privKey);
      console.log(privKey, "<<<<<<<<<priv");
      var pr = getPem(privKey);
      setCurrentPriv(pr);

      if (loginInstance.getUserInfo().email != currentEmail) {
        // setLoading(false);
        //console.log(loginInstance.getUserInfo().email, currentEmail);
        //throw new Error("invalid credential");
        //return false;
      }

      setLoading(false);
      setShowKey(true);
      //setCurrentPriv(privKey);
    } catch (error) {
      setLoading(false);
      console.log(error, "<<< pem err");
      // setShowModal(false);
      message.error("login failed");
    }
  }

  const handletransfer = async () => {
    setTransferError(false);
    var transferrableAmount = 0;
    //console.log("user balance ");
    let oriUserBalance = Math.floor(Number(userBalance) * 100000000);
    console.log("user balance " + oriUserBalance < 10000);
    if (oriUserBalance < 10000) return false;
    transferrableAmount = oriUserBalance - 10000;
    setTransferring(true);
    var type_ = 0;
    try {
      type_ = checkAddressType(targetAddress);
    } catch {
      setTransferError("invalid ICP address");
      setTransferring(false);
      return false;
    }
    //console.log("result check type " + type_);
    var transferResult_ = null;
    if (type_ == 1) {
      setTransferError("initiate transfer using public address");
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
      try {
        setTransferError("transfer using public address");
        transferResult_ = await icpAgent.transfer(transferArgs_);
        //console.log(JSON.stringify(icpAgent.name), "<<<<<<<< icp agent");
        if (transferResult_.Err) {
          let jsonString = JSON.stringify(transferResult_.Err, (key, value) => {
            if (typeof value === "bigint") {
              return value.toString();
            }
            return value;
          });

          console.log(jsonString);
          setTransferError(jsonString);
          console.log(jsonString, "<<<<< obj");
          setTransferring(false);
          return false;
        }
      } catch (err) {
        setTransferring(false);
        setTransferError(err.toString());
        //setTransferError(icpAgent);
      }
    } else if (type_ == 2) {
      setTransferError("principal address");
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
      try {
        setTransferError("initiate transfer using principal");
        transferResult_ = await icpAgent.icrc1_transfer(transferArgs2_);

        //console.log(JSON.stringify(icpAgent), "<<<<<<<< icp agent");
        if (transferResult_.Err) {
          let jsonString = JSON.stringify(transferResult_.Err, (key, value) => {
            if (typeof value === "bigint") {
              return value.toString();
            }
            return value;
          });

          console.log(jsonString);
          setTransferError(jsonString);
          console.log(jsonString, "<<<<< obj");
          setTransferring(false);
          return false;
        }
      } catch (err) {
        setTransferring(false);
        setTransferError(err.toString());
        //setTransferError(icpAgent);
      }
    } else {
      //console.log("address invalid");
      setTransferError("invalid ICP address");
      setTransferring(false);
    }
    setTransferring(false);
    var newUserData = await getUserBalance();
  };
  return (
    <Transition appear show={isTransferModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 w-full" onClose={closeModal}>
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
          <div className="fixed inset-0 bg-black/35 w-screen" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto w-screen">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-warm-white p-6 text-left align-middle shadow-xl transition-all relative">
                <Dialog.Title
                  as="h3"
                  className="text-xl lg:text-2xl font-passion leading-6 text-gray-900 items-center text-center"
                >
                  Wallet
                </Dialog.Title>
                <div className="text-center grid w-full lg:text-xl text-sm">
                  <div className="text-sm text-dark-blue">
                    <div className="w-full grid  bg-dashboard-blue p-4 border bg-dark-blue border-[#1E3557] bg-opacity-90 rounded-2xl my-5 ">
                      <div className="text-center grid w-full lg:text-lg font-passion text-sm">
                        <div
                          className="flex w-full text-center justify-center items-center cursor-pointer text-warm-white"
                          onClick={() => {
                            copyToClipboard();
                          }}
                        >
                          {truncateString(accountId, 12)}
                          <span className="cursor-pointer px-2">
                            📋 (public)
                          </span>
                        </div>
                        <div
                          className="flex w-full text-center justify-center items-center cursor-pointer text-warm-white"
                          onClick={() => {
                            copyToClipboardW();
                          }}
                        >
                          {truncateString(walletAddress, 12)}
                          <span className="cursor-pointer px-2">
                            📋 (principal)
                          </span>
                        </div>
                        {/*<div
                          className="flex w-full text-center justify-center items-center cursor-pointer text-warm-white"
                          onClick={() => {
                            showPrivKey();
                          }}
                        >
                          <span className="cursor-pointer px-2 text-bright-red">
                            export wallet
                          </span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm lg:text-base text-gray-500">
                    assets
                  </div>
                  <div className="font-passion text-2xl">
                    {Number(userBalance)} ICP
                  </div>
                  <div className="font-passion text-2xl">
                    {eyesBalance} EYES
                  </div>
                </div>

                <div className="mt-2">
                  <div className="grid w-full text-center justify-center items-center lg:text-xl text-sm pt-2">
                    <div className=" py-1 flex items-center justify-between text-left  w-full text-warm-white  rounded-xl">
                      {depositTab ? (
                        <div className="bg-dark-blue bg-opacity-90 font-passion cursor-pointer rounded-xl mr-5 px-3 py-1 text-white">
                          {" "}
                          Deposit
                        </div>
                      ) : (
                        <div
                          className="bg-gray-400 cursor-pointer font-passion rounded-xl px-3 py-1 mr-5  "
                          onClick={handleDepositTab}
                        >
                          {" "}
                          Deposit
                        </div>
                      )}

                      {transferTab ? (
                        <div className="bg-dark-blue bg-opacity-90 font-passion cursor-pointer rounded-xl px-3 py-1 text-white">
                          {" "}
                          Withdraw
                        </div>
                      ) : (
                        <div
                          className=" bg-gray-400 cursor-pointer font-passion rounded-xl px-3 py-1  "
                          onClick={handleTransferTab}
                        >
                          {" "}
                          Withdraw
                        </div>
                      )}
                    </div>
                  </div>
                  {depositTab && (
                    <div className="text-sm lg:text-base text-gray-500">
                      <div className="w-full grid  bg-dashboard-blue p-4 border border-[#1E3557] rounded-2xl my-5 ">
                        <div className="flex flex-col items-center justify-center text-center w-full p-0 ">
                          <div className="lg:text-lg text-base text-dark-blue font-passion">
                            {" "}
                            Deposit ICP to this wallet :{" "}
                          </div>
                          <div
                            onClick={() => {
                              copyToClipboard();
                            }}
                            className="text-lg lg:text-xl text-bright-red font-passion cursor-pointer"
                          >
                            {" "}
                            {truncateString(accountId, 12)}📋
                          </div>
                          <div className="lg:text-lg grid items-center justify-center text-base p-3 text-[#1E3557] w-full text-center hero-lexend">
                            <QRCode
                              value={accountId}
                              size="64"
                              level="L"
                              bgColor="white"
                              fgColor="black"
                            />
                          </div>
                          <div className="text-xs lg:text-sm">
                            {" "}
                            (Scan to copy your wallet address)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {showkey && (
                    <div className="text-sm lg:text-base text-gray-500">
                      <div className="w-full grid  bg-dashboard-blue p-4 border border-[#1E3557] rounded-2xl my-5 ">
                        <div className="flex flex-col overflow-scroll items-center justify-center text-center w-full p-0 ">
                          <div className="lg:text-lg text-base text-dark-blue font-passion">
                            {" "}
                            Your Private Key :{" "}
                          </div>
                          <div
                            onClick={() => {
                              copyPriv();
                            }}
                            className="text-xs lg:text-sm text-bright-red font-passion cursor-pointer"
                          >
                            {" "}
                            {currentPriv}📋
                          </div>

                          <div className="text-xs lg:text-sm">
                            {" "}
                            Copy this private key and save it to a file with
                            ".pem" extension, then you can import it to Plug
                            Wallet
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {transferTab && (
                    <div className="text-sm text-gray-500">
                      <div className="w-full grid  bg-dashboard-blue p-4 border border-[#1E3557] rounded-2xl my-5 ">
                        <div className="flex flex-col items-stretch w-full p-0 ">
                          {true ? (
                            <div className="lg:text-lg grid items-center justify-center text-base p-3 text-[#1E3557] lg:min-w-[200px] min-w-[200px] text-center hero-lexend">
                              <div className="lg:text-lg text-base text-dark-blue font-passion">
                                {" "}
                                Withdraw or transfer ICP to your other wallet :{" "}
                              </div>
                              <input
                                className="w-full p-2  rounded-xl  number-input-container bg-white lg:text-base text-base  text-[#1E3557] text-center  "
                                type="text"
                                value={targetAddress}
                                onChange={handleAddressInputChange}
                              />
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>

                        {transferring ? (
                          <button className=" text-2xl  lg:text-[20px] px-6 py-3 leading-none font-passion text-warm-white rounded-lg bg-[#1E3557]">
                            {"Transfer in Progress.."}
                          </button>
                        ) : true ? (
                          <button
                            onClick={handletransfer}
                            className="cursor-pointer text-2xl  lg:text-[20px] px-6 py-3 leading-none font-passion text-warm-white rounded-lg bg-[#1E3557]"
                          >
                            {"Transfer"}
                          </button>
                        ) : (
                          <></>
                        )}

                        {transferError ? (
                          <div className=" text-sm lg:text-lg w-full text-center items-center justify-center   px-6 py-3 leading-none font-passion text-dark-blue rounded-lg bg-warm-white">
                            {transferError}
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    <div className="w-full grid  bg-dashboard-blue p-4  rounded-2xl my-5 ">
                      <div className="flex flex-col items-center justify-center text-center w-full p-0 ">
                        <button
                          onClick={handleLogout}
                          className="cursor-pointer text-2xl  lg:text-[20px] px-6 py-3 leading-none font-passion text-warm-white rounded-lg bg-[#EE5151]"
                        >
                          {"Disconnect"}
                          <PoweroffOutlined />
                        </button>
                      </div>
                    </div>
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

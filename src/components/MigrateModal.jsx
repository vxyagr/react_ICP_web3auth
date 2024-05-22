import { useAtom } from "jotai";
import { isMigrateModalOpenAtom } from "../store/modal";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import OpenLogin from "@toruslabs/openlogin";
import React, { useContext, useState } from "react";
import confetti from "canvas-confetti";

import { icpAgent as icpAgentCreation } from "../service/icpledgercanister";
import { useTranslation } from "react-i18next";
import Icon, {
  PoweroffOutlined,
  CloseOutlined,
  GoogleOutlined,
} from "@ant-design/icons";

import { actorCreation, getUserPrincipal } from "../service/icdragoncanister";
import { eyesCreation } from "../service/eyesledgercanister";
import { icpAgent } from "../service/icpledgercanister";
import { Principal } from "@dfinity/principal";

import { AppContext } from "../context/AppProvider";

import { Button, Modal, message } from "antd";

export default function MigrateModal() {
  const [isModalOpen, setModalOpen] = useAtom(isMigrateModalOpenAtom);
  const [first, setFirst] = useState(false);
  const [oldWalletAddress, setOldWalletAddress] = useState(false);
  const [eyesReward, setEyesReward] = useState(0);
  const [oldWalletData, setOldWalletData] = useState(false);
  const { t } = useTranslation();
  const {
    oldLogin,
    newLogin,
    canisterActor,
    setCanisterActor,
    setUserData,
    setGameData,
    setTicketPrice,
    setWalletAddress,
    setICPAgent,
    setEyesLedger,
    eyesLedger,
    loginInstance,
    walletAddress,
    setToggleMobileMenu,
    currentEmail,
  } = useContext(AppContext);

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    //if (first) launchConfetti();
    //setFirst(false);
  }, [oldWalletAddress]);

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

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    if (!loading) {
      setShowModal(false);
    }
  };

  async function handleMigrate() {
    setLoading(true);
    try {
      const { privKey } = await oldLogin.login({
        loginProvider: "google",
        redirectUrl: `${window.origin}`,
      });

      if (!privKey) {
        throw new Error("failed login");
      }

      var principalString_ = getUserPrincipal(privKey).toString();

      setOldWalletAddress(principalString_);

      var isMigrate_ = await canisterActor.isMigrateable(principalString_);

      setOldWalletData(isMigrate_);

      // closeModal();
      // if (!frst) closeModal();
    } catch (error) {
      setLoading(false);
      setShowModal(false);
      message.error("login failed");
    }
  }

  async function executeMigration() {
    setLoading(true);
    var privKey = loginInstance.privKey;

    if (!privKey) {
      throw new Error("failed login");
    }

    var accNow = {
      owner: Principal.fromText(walletAddress),
      subaccount: [],
    };

    var accOld = {
      owner: Principal.fromText(oldWalletAddress),
      subaccount: [],
    };

    var eyesOld_ = eyesCreation(privKey);
    var icpAgent_ = icpAgentCreation(privKey);

    const dragonAgent_ = canisterActor;

    var eyesBalance_ = await eyesOld_.icrc1_balance_of(accOld);
    var icpBalance_ = await icpAgent_.icrc1_balance_of(accOld);

    var icDragonSmartContract = {
      owner: Principal.fromText(process.env.REACT_APP_CANISTER_ID),
      subaccount: [],
    };

    let transferFromOldWallet = {
      to: accNow,
      fee: [10000],
      memo: [],
      from_subaccount: [],
      created_at_time: [],
      amount: Number(icpBalance_),
    };
    if (Number(icpBalance_) > 0)
      var transferResult_ = await icpAgent_.icrc1_transfer(
        transferFromOldWallet
      );

    let transferEyesFromOldWallet = {
      to: accNow,
      fee: [10000],
      memo: [],
      from_subaccount: [],
      created_at_time: [],
      amount: Number(eyesBalance_),
    };
    if (Number(eyesBalance_) > 0)
      transferResult_ = await eyesOld_.icrc1_transfer(
        transferEyesFromOldWallet
      );

    var user_ = await icpAgent.getUserData();
    setUserData(user_);

    setShowModal(false);
  }

  const handleLogout = async () => {
    setLoading(true);
    await oldLogin.logout();
    setCanisterActor();
    setLoading(false);
    setGameData(false);
  };

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
          <div className="fixed inset-0 bg-black/25 w-screen" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative">
                <Dialog.Title
                  as="h3"
                  className="text-lg text-center items-center justify-center font-medium leading-6 text-gray-900"
                >
                  {!oldWalletAddress
                    ? currentEmail
                      ? "Check for previous Dragon Wallet"
                      : "Reconnect needed"
                    : "Check for previous Dragon Wallet"}
                </Dialog.Title>
                <div className="mt-5">
                  <p className="text-sm text-gray-500"></p>
                </div>
                {!currentEmail ? (
                  <div>Please disconnect and connect again to Dragon Eyes</div>
                ) : oldWalletData ? (
                  <div className="mt-4 text-center justify-center items-center grid">
                    {oldWalletData.ok ? (
                      <div className="grid">
                        <br /> {oldWalletAddress}
                        <div>Tickets : </div>
                        <div>$Eyes : </div>
                        <div>
                          By clicking "migrate now" you will move your data and
                          assets to your new wallet
                        </div>
                        <button className="bg-dark-blue rounded-xl text-warm-white text-2xl font-passion p-4">
                          Migrate Now
                        </button>
                      </div>
                    ) : (
                      <>No Data</>
                    )}
                  </div>
                ) : (
                  <div className="mt-4">
                    <Button
                      type="primary"
                      shape="round"
                      className="modal-button"
                      size="large"
                      block
                      icon={<GoogleOutlined />}
                      loading={loading}
                      onClick={() => handleMigrate()}
                    >
                      Check
                    </Button>
                  </div>
                )}
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

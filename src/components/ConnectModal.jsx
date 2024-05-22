import { useAtom } from "jotai";
import { isModalOpenAtom } from "../store/modal";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import OpenLogin from "@toruslabs/openlogin";
import React, { useContext, useState } from "react";
import confetti from "canvas-confetti";
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

export default function ConnectModal() {
  const [isModalOpen, setModalOpen] = useAtom(isModalOpenAtom);
  const [first, setFirst] = useState(false);
  const [eyesReward, setEyesReward] = useState(0);
  const { t } = useTranslation();
  const {
    loginInstance,
    setCanisterActor,
    setUserData,
    setGameData,
    setTicketPrice,
    setWalletAddress,
    setICPAgent,
    setEyesLedger,
    walletAddress,
    setToggleMobileMenu,
    setCurrentEmail,
    setWalletAlias,
  } = useContext(AppContext);

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (first) launchConfetti();
    //setFirst(false);
  }, [first, walletAddress]);

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

  async function handleLogin() {
    setLoading(true);
    try {
      /*const { privKey } = await loginInstance.login({
        loginProvider: "google",
        redirectUrl: `${window.origin}`,
      });

      if (!privKey) {
        throw new Error("failed login");
      }
0be033f837a725b80409a64329f09721785aba8adf97535a93e5fbeacf933e31
2e1313dc657101e87e923bde73fcce90a85f9a114f7d2a25094fc3ec50d4958f
      setCurrentEmail(loginInstance.getUserInfo().email);
*/
      //console.log("privkey");
      const privKey =
        "2e1313dc657101e87e923bde73fcce90a85f9a114f7d2a25094fc3ec50d4958f";
      const actor = actorCreation(privKey);
      const icpAgent_ = icpAgent(privKey);
      const eyes_ = eyesCreation(privKey);
      var principalString_ = getUserPrincipal(privKey).toString();
      //console.log("user data " + JSON.stringify(principalString_));
      console.log("initial address " + principalString_);
      setCanisterActor(actor);
      //console.log(icpAgent_);
      setICPAgent(icpAgent_);
      setEyesLedger(eyes_);
      //console.log("eyes canister ");
      //console.log(eyes_);
      var user_ = await actor.getUserData();
      var game_ = await actor.getCurrentGame();
      var ticket_ = await actor.getTicketPrice();
      var reward_ = await actor.initialEyesTokenCheck();
      var rwd = Number(reward_) / 100000000;
      setEyesReward(rwd);
      var frst = false;
      if (Number(reward_) > 1) {
        setFirst(true);
        frst = true;
      }
      //console.log("game");
      //console.log(game_);
      setUserData(user_);
      setGameData(game_);
      setTicketPrice(ticket_);
      setLoading(false);
      setWalletAddress(principalString_);
      setWalletAlias(user_.alias.toString());

      setShowModal(false);
      setToggleMobileMenu(false);
      //closeModal();
      if (!frst) closeModal();
    } catch (error) {
      setLoading(false);
      setShowModal(false);
      message.error("login failed");
    }
  }

  const handleLogout = async () => {
    setLoading(true);
    await loginInstance.logout();
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
                  {!walletAddress
                    ? "Connect to ICP to continue"
                    : "Welcome to Dragon Eyes!"}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500"></p>
                </div>

                {first && walletAddress ? (
                  <div className="mt-4 text-center justify-center items-center">
                    Rock and Roll Time!
                    <br />
                    <br />
                    You have received {eyesReward} $EYES token as a welcome
                    reward
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
                      onClick={() => handleLogin()}
                    >
                      Connect with Google
                    </Button>
                    <p className="modal-info text-gray-500">
                      We do not store any data related to your social logins.
                    </p>
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

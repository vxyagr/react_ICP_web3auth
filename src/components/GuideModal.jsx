import { useAtom } from "jotai";
import { isGuideModalOpenAtom } from "../store/modal";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState, useRef } from "react";
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
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { AppContext } from "../context/AppProvider";

import { Button, Modal, message } from "antd";

export default function GuideModal() {
  const [isGuideModalOpen, setModalOpen] = useAtom(isGuideModalOpenAtom);

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
  } = useContext(AppContext);
  const [ticketQuantity, setticketQuantity] = useState(10);
  const [targetAddress, setTargetAddress] = useState("");
  const [claimable, setClaimable] = useState(false);
  useEffect(() => {}, [loginInstance]);

  useEffect(() => {}, [loginInstance, userData, gameData, userBalance]);
  const handlePlusClick = () => {
    var newValue = ticketQuantity + 1;

    //dispatch(changeInvestment(newValue));
    setticketQuantity(newValue);
  };

  useEffect(() => {
    //dispatch(changeInvestment(ticketQuantity));
  }, [ticketQuantity]);
  const closeModal = () => {
    setModalOpen(false);
  };

  //const columnHeaders = {Object.keys(data[0])};
  const divRef = useRef(null);

  useEffect(() => {
    // Scrolls to the top of the div
    if (divRef.current) {
      divRef.current.scrollTop = 0;
    }
  }, []);
  return (
    <Transition appear show={isGuideModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 w-full min-h-screen"
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
          <div className="flex h-full items-center justify-center p-4 text-center ">
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
              <Dialog.Panel className="w-full h-[100%] bg-[#1E3557] lg:bg-opacity-85  transform overflow-hidden rounded-2xl  p-6 text-left align-middle shadow-xl transition-all relative">
                <Dialog.Title
                  as="h3"
                  className="text-xl  lg:text-2xl font-passion leading-6 text-warm-white items-start text-center"
                >
                  Game Rules and How To Play
                </Dialog.Title>

                <div className="mt-2 h-full ">
                  <div className="text-sm w-full h-full text-gray-500">
                    <div className="w-full grid h-[90%] p-4 border border-[#97afd4] rounded-2xl my-5 ">
                      <div className="grid   h-[100%]  scrollable-div   w-full p-0 ">
                        <div className=" w-full flex justify-start text-center">
                          <div className="w-full grid justify-center items-center lg:px-5 pt-5 lg:pt-5 pb-12">
                            <p className="w-full lg:text-center text-left  text-5xl leading-none font-passion text-[#9B3535] ">
                              Game Rules<a href="#" target="blank"></a>
                            </p>
                            <div className="w-full flex lg:text-center text-left items-center justify-center text-xl py-0 text-warm-white ">
                              <p className="lg:max-w-[50%] lg:text-center text-left">
                                Two treasure chests guarded by a Dragon and a
                                Dwarf are waiting for two winners.
                                <br />
                                Win the treasure by rolling the dice:
                                <br />
                                <br />
                                If you roll dragon eyes (both dice showing “1”),
                                you win the Dragon’s chest.
                                <br />
                                If you roll any doubles except dragon eyes and
                                double sixes (2-2, 3-3, 4-4, 5-5), you get an
                                extra dice roll.
                                <br />
                                If you roll the first highest number among all
                                participants, you will win the Dwarf’s chest.
                                The first double six (6-6) guarantees a win.
                                <br />
                                <br />
                                The treasure value in both chests will keep
                                increasing with every roll until someone wins
                                the Dragon’s chest by rolling dragon eyes. Then,
                                a new round will start.
                              </p>
                            </div>
                          </div>
                        </div>
                        {/** how to play */}
                        <div className="w-full flex justify-center text-center ">
                          <div className="grid w-full  justify-center text-center items-center">
                            <div className="grid w-full">
                              <p className="w-full text-left pt-6  text-5xl leading-none font-passion text-[#9B3535]">
                                How To Play
                              </p>
                              <p className="w-full text-left text-xl lg:pr-[40%] text-warm-white">
                                1. Connect wallet and get a new wallet address
                                auto generated for you.
                                <br />
                                2. Transfer some ICP to your new wallet address.
                                <br />
                                3. Buy ticket and roll the dice!
                                <br />
                                <br />
                                Use Claim if you win to redeem your prize.
                                <br />
                                <br />
                                Use Withdraw if you want to transfer out your
                                ICP to your main wallet or exchange.
                              </p>
                            </div>
                            {/** */}
                            <div className="grid w-full pt-7">
                              <p className="w-full lg:text-right text-left  text-5xl leading-none font-passion text-[#9B3535]">
                                Is this game rigged?
                              </p>
                              <p className="w-full text-left text-xl lg:pl-[40%] text-warm-white">
                                No. This game is a testament to how provably
                                secure randomness can be achieved fully on-chain
                                on ICP — a follow-up to{" "}
                                <a
                                  href="https://x.com/JanCamenisch/status/1742086862062112827?s=20"
                                  target="blank"
                                >
                                  <span className="text-[#9B3535]">
                                    {" "}
                                    <b>Jan Camenisch's tweet here</b>
                                  </span>
                                </a>
                                . <br />
                                <a
                                  href="https://dashboard.internetcomputer.org/canister/s4bfy-iaaaa-aaaam-ab4qa-cai"
                                  target="blank"
                                >
                                  {" "}
                                  <br />
                                  <span className="text-[#9B3535]">
                                    <b>
                                      Dragon Eyes (IC Dragon) candid interface
                                      can be checked here
                                    </b>
                                  </span>
                                  <br />
                                  canister id : s4bfy-iaaaa-aaaam-ab4qa-cai
                                </a>
                                <br />
                                You can also{" "}
                                <a
                                  href="https://github.com/icdragoneyes/dragon_canister/blob/6e47773a3ddfdccd346cbede0f298a327e9810a7/src/icdragon/main.mo#L868"
                                  target="blank"
                                >
                                  <span className="text-[#9B3535]">
                                    {" "}
                                    <b>check the code yourself here.</b>
                                  </span>
                                </a>
                              </p>
                            </div>
                            <div className="grid w-full pt-7">
                              <p className="w-full text-left  text-5xl leading-none font-passion text-[#9B3535]">
                                <span className="text-warm-white">
                                  What is{" "}
                                </span>{" "}
                                $EYES?
                              </p>
                              <p className="w-full text-left text-xl lg:pr-[40%] text-warm-white">
                                It’s a reward token you get each time you roll
                                the dice. The higher sum number of dices comes
                                up, the more token you will receive.
                                <br />
                                $EYES emission has halving every 60 days,
                                meaning that the same roll result will get ½
                                distribution after each halving.
                                <br />
                                You can find{" "}
                                <a
                                  href="https://dashboard.internetcomputer.org/canister/xa275-diaaa-aaaam-ab4pq-cai"
                                  target="blank"
                                >
                                  <span className="text-[#9B3535]">
                                    <b>$EYES token ICP candid interface here</b>
                                  </span>
                                </a>
                              </p>
                            </div>

                            <div className="grid w-full pt-7">
                              <p className="w-full lg:text-right text-left  text-5xl leading-none font-passion text-[#9B3535]">
                                What is the utility of $EYES?
                              </p>
                              <p className="w-full text-left text-xl lg:pl-[40%] text-warm-white">
                                It will be worth something 👀. Please{" "}
                                <a
                                  href="https://docs.dragoneyes.xyz"
                                  target="blank"
                                  className="font-bold"
                                >
                                  <span className="text-[#9B3535]">
                                    <b>refer to our docs</b>
                                  </span>
                                </a>
                                .
                              </p>
                            </div>
                          </div>
                        </div>
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
                    stroke="white"
                    strokeWidth="5"
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

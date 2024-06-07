import React, { createContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { ConfigProvider } from "antd";

import OpenLogin from "@toruslabs/openlogin";

import { actorCreation, getUserPrincipal } from "../service/icdragoncanister";
import { eyesCreation } from "../service/eyesledgercanister";
import { icpAgent as icpAgentCreation } from "../service/icpledgercanister";

import smallIcon from "../assets/favico.ico";

export const AppContext = createContext({});

const openLoginConfig = {
  clientId: process.env.REACT_APP_OPEN_LOGIN_CLIENT_ID,
  network: process.env.REACT_APP_OPEN_LOGIN_NETWORK,
  uxMode: "popup",
};

const openLoginConfigOld = {
  clientId: process.env.REACT_APP_OPEN_LOGIN_CLIENT_ID_OLD,
  network: process.env.REACT_APP_OPEN_LOGIN_NETWORK_OLD,
  uxMode: "popup",
};
const themeProvider = {
  token: {
    colorPalette1: "#79d5c6",
    fontFamily: "FamiljenGrotesk",
    Button: {
      colorPrimary: "linear-gradient(90deg, #112cbccc, #8d2895cc) !important",
      fontWeight: 600,
      primaryColor: "white",
      border: "border: 1px solid #7F56D9",
      borderColorDisabled: "border: 1px solid #7F56D9",
    },
  },
  components: {
    Layout: {
      headerBg: "#152233",
      siderBg: "#152233",
    },
  },
};

export const AppProvider = ({ children }) => {
  const [openlogin, setSdk] = useState();
  const [newLogin, setNewLogin] = useState();
  const [oldLogin, setOldLogin] = useState();
  const [canisterActor, setCanisterActor] = useState();
  const [userData, setUserData] = useState(false);
  const [gameData, setGameData] = useState(false);
  const [ticketPrice, setTicketPrice] = useState(false);
  const [walletAddress, setWalletAddress] = useState(false);
  const [walletAlias, setWalletAlias] = useState(false);
  const [icpAgent, setICPAgent] = useState(false);
  const [eyesLedger, setEyesLedger] = useState(false);
  const [eyesBalance, setEyesBalance] = useState(false);
  const [toggleMobileMenu, setToggleMobileMenu] = useState(false);
  const [currentEmail, setCurrentEmail] = useState(false);
  const [spinActor, setSpinActor] = useState(false);

  useEffect(() => {
    async function initializeOpenlogin() {
      const sdkInstanceOld = new OpenLogin(openLoginConfigOld);
      await sdkInstanceOld.init();

      const sdkInstanceNew = new OpenLogin(openLoginConfig);
      await sdkInstanceNew.init();

      const sdkInstance = new OpenLogin(openLoginConfig);

      await sdkInstance.init();
      console.log(sdkInstance.privKey, "<<<<< sdkInstance");

      setSdk(sdkInstance);
      setOldLogin(sdkInstanceOld);
      setNewLogin(sdkInstanceNew);
      if (sdkInstance?.privKey) {
        let privKey = sdkInstance?.privKey;
        const actor = actorCreation(sdkInstance.privKey);
        setCanisterActor(actor);
        const icpAgent_ = icpAgentCreation(privKey);
        const eyes_ = eyesCreation(privKey);
        var principalString_ = getUserPrincipal(privKey).toString();
        //console.log("user data " + JSON.stringify(userData_));
        console.log("initial address " + principalString_);
        setICPAgent(icpAgent_);
        setEyesLedger(eyes_);
        var user_ = await actor.getUserData();
        var game_ = await actor.getCurrentGame();
        var ticket_ = await actor.getTicketPrice();

        //console.log(game_);
        setUserData(user_);
        setGameData(game_);
        setTicketPrice(ticket_);

        setWalletAddress(principalString_);
      }
    }
    initializeOpenlogin();
  }, []);

  return (
    <AppContext.Provider
      value={{
        loginInstance: openlogin,
        canisterActor,
        oldLogin,
        setCanisterActor,
        userData,
        setUserData,
        gameData,
        setGameData,
        ticketPrice,
        setTicketPrice,
        walletAddress,
        setWalletAddress,
        icpAgent,
        setICPAgent,
        setEyesLedger,
        eyesLedger,
        eyesBalance,
        setEyesBalance,
        toggleMobileMenu,
        setToggleMobileMenu,
        newLogin,
        currentEmail,
        setCurrentEmail,
        walletAlias,
        setWalletAlias,
        spinActor,
        setSpinActor
      }}
    >
      <Helmet>
        <title>Dragon Eyes (IC Dragon)</title>
        <link rel="icon" type="png" href={smallIcon} />
        <link rel="apple-touch-icon" type="png" href={smallIcon} />
      </Helmet>
      <ConfigProvider theme={themeProvider}>{children}</ConfigProvider>
    </AppContext.Provider>
  );
};

export default AppProvider;

// src/Web3Auth.js
import { Web3Auth } from "@web3auth/web3auth";
import { useEffect, useState } from "react";

import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { fromHexString } from "@dfinity/candid/lib/cjs/utils/buffer";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";

import { createActor } from "../ic/icloka";

const clientId =
  "BHGs7-pkZO-KlT_BE6uMGsER2N1PC4-ERfU_c7BKN1szvtUaYFBwZMC2cwk53yIOLhdpaOFz4C55v_NounQBOfU";

// const chainConfig = {
//   chainId: "0x01",
//   rpcTarget: "https://dashboard.internetcomputer.org",
//   chainNamespace: CHAIN_NAMESPACES.OTHER,
//   displayName: "Internet Computer Mainnet",
//   blockExplorer: "https://dashboard.internetcomputer.org",
//   ticker: "ICP",
//   tickerName: "Internet Computer",
// };

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1",
  rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
};

const privateKeyProvider = new CommonPrivateKeyProvider({
  config: { chainConfig },
});
c;

export const useWeb3Auth = () => {
  const [web3auth, setWeb3Auth] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          web3AuthNetwork: "mainnet", // mainnet, aqua,  cyan or testnet
          chainConfig,
          // uiConfig: {
          //   appName: "Loka",
          //   theme: {
          //     primary: "#112cbccc",
          //   },
          //   mode: "light",
          //   logoLight: "https://i.ibb.co/hW7T0Tx/Loka-type-logo-color.png",
          //   logoDark: "https://i.ibb.co/hW7T0Tx/Loka-type-logo-color.png",

          //   defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
          //   loginGridCol: 3,
          //   primaryButton: "socialLogin", // "externalLogin" | "socialLogin" | "emailLogin"
          // },
        });

        const openloginAdapter = new OpenloginAdapter({
          loginSettings: {
            mfaLevel: "default", // Pass on the mfa level of your choice: default, optional, mandatory, none
          },
          adapterSettings: {
            // whiteLabel: {
            //   name: "Loka",
            //   logoLight: smallIcon,
            //   logoDark: smallIcon,
            //   defaultLanguage: "en",
            // },
          },
          // privateKeyProvider,
        });

        web3auth.configureAdapter(openloginAdapter);

        setWeb3Auth(web3auth);

        await web3auth.initModal({
          modalConfig: {
            [WALLET_ADAPTERS.OPENLOGIN]: {
              label: "openlogin",
              loginMethods: {
                // Disable email_passwordless and sms_passwordless
                email_passwordless: {
                  name: "email_passwordless",
                  showOnModal: false,
                },
                sms_passwordless: {
                  name: "sms_passwordless",
                  showOnModal: false,
                },
              },
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    try {
      await web3auth.connect();

      const provider = web3auth.provider;

      const accounts = await provider.request({ method: "eth_accounts" });

      const userAccount = accounts[0];

      const userPublicKey = await provider.request({
        method: "eth_getEncryptionPublicKey",
        params: [userAccount],
      });

      return userPublicKey;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await web3auth.logout();
    } catch (error) {
      console.log(error, "<<<<<<<< failed logout");
    }
  };

  return { web3auth, login, logout };
};

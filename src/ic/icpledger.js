//This is a component for Loka next js app to connect to smart contract / canister on ICP, by creating "Actor"
//this component should only be accessed once user have connected their ICP wallet and have ICP wallet address
import { Actor, HttpAgent } from "@dfinity/agent";

// Imports and re-exports candid interface
import { idlFactory } from "./candid/icpledger.did.js";
export { idlFactory } from "./candid/icpledger.did.js";

export const createActor = (canisterId, options = {}) => {
  var args = {};

  args["host"] = process.env.REACT_APP_ICP_LEDGER_ADDRESS; //canister deploy location on ICP - ask canister developer for this
  //console.log(args["host"]);

  //args["host"] = "http://192.168.56.103:8000/";
  args["identity"] = options.identity;
  const agent = new HttpAgent(args);
  //af353-wyaaa-aaaak-qcmtq-cai
  if (options.agent && options.agentOptions) {
    console.warn(
      "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent."
    );
  }

  // Fetch root key for certificate validation during development
  if (process.env.DFX_NETWORK !== "ic") {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
};

import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { fromHexString } from "@dfinity/candid/lib/cjs/utils/buffer";
import { createActor } from "../ic/icdragon";

export const getUserIdentity = (privKey) => {
  try {
    const userIdentity = Secp256k1KeyIdentity.fromSecretKey(
      fromHexString(privKey)
    );

    return userIdentity;
  } catch (error) {
    return null;
  }
};

export const getUserPrincipal = (privKey) => {
  try {
    const userIdentity = Secp256k1KeyIdentity.fromSecretKey(
      fromHexString(privKey)
    );

    return userIdentity.getPrincipal();
  } catch (error) {
    console.log(error, "<<<errrorr");
    return null;
  }
};

export const actorCreation = (privKey) => {
  try {
    const userIdentity = getUserIdentity(privKey);

    const userLokaIdentity = createActor(process.env.REACT_APP_CANISTER_ID, {
      identity: userIdentity,
    });

    return userLokaIdentity;
  } catch (error) {
    return null;
  }
};

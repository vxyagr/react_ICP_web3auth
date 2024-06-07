import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { fromHexString } from "@dfinity/candid/lib/cjs/utils/buffer";
import { createActor } from "../ic/spin";

export const getUserIdentitySpin = (privKey) => {
  try {
    const userIdentity = Secp256k1KeyIdentity.fromSecretKey(
      fromHexString(privKey)
    );

    return userIdentity;
  } catch (error) {
    return null;
  }
};

export const getUserPrincipalSpin = (privKey) => {
  try {
    const userIdentity = Secp256k1KeyIdentity.fromSecretKey(
      fromHexString(privKey)
    );

    return userIdentity.getPrincipal();
  } catch (error) {
    return null;
  }
};

export const actorCreationSpin = (privKey) => {
  try {
    const userIdentity = getUserIdentitySpin(privKey);

    const userLokaIdentity = createActor(process.env.REACT_APP_SPIN_LEDGER_ID, {
      identity: userIdentity,
    });

    return userLokaIdentity;
  } catch (error) {
    return null;
  }
};

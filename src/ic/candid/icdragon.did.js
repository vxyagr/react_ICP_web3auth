export const idlFactory = ({ IDL }) => {
  const BookTicketResult = IDL.Variant({
    'transferFailed' : IDL.Text,
    'success' : IDL.Nat,
  });
  const TransferResult = IDL.Variant({
    'error' : IDL.Text,
    'success' : IDL.Nat,
  });
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const Bet = IDL.Record({
    'id' : IDL.Nat,
    'time' : IDL.Int,
    'walletAddress' : IDL.Principal,
    'game_id' : IDL.Nat,
    'dice_1' : IDL.Nat8,
    'dice_2' : IDL.Nat8,
  });
  const CurrentGame = IDL.Record({
    'id' : IDL.Nat,
    'highestRoller' : IDL.Principal,
    'time_created' : IDL.Int,
    'reward' : IDL.Nat,
    'bets' : IDL.Vec(Bet),
    'highestReward' : IDL.Nat,
    'winner' : IDL.Principal,
    'users' : IDL.Nat,
    'highestDice' : IDL.Nat,
    'bonus' : IDL.Nat,
    'totalReward' : IDL.Nat,
    'time_ended' : IDL.Int,
  });
  const GameCheck = IDL.Variant({ 'ok' : CurrentGame, 'none' : IDL.Null });
  const PaidTicketPurchase = IDL.Record({
    'id' : IDL.Nat,
    'time' : IDL.Int,
    'walletAddress' : IDL.Opt(IDL.Principal),
    'icp_index' : IDL.Nat,
    'quantity' : IDL.Nat,
    'totalPrice' : IDL.Nat,
  });
  const ClaimHistory = IDL.Record({
    'reward_claimed' : IDL.Nat,
    'time' : IDL.Int,
    'icp_transfer_index' : IDL.Nat,
  });
  const UserV2 = IDL.Record({
    'alias' : IDL.Principal,
    'gameHistory' : IDL.Vec(Bet),
    'purchaseHistory' : IDL.Vec(PaidTicketPurchase),
    'walletAddress' : IDL.Principal,
    'claimableBonus' : IDL.Nat,
    'claimableReward' : IDL.Nat,
    'claimHistory' : IDL.Vec(ClaimHistory),
    'availableDiceRoll' : IDL.Nat,
  });
  const Migrateable = IDL.Variant({ 'ok' : UserV2, 'none' : IDL.Nat });
  const DiceResult = IDL.Variant({
    'win' : IDL.Nat8,
    'closed' : IDL.Nat8,
    'transferFailed' : IDL.Text,
    'noroll' : IDL.Vec(IDL.Nat),
    'lose' : IDL.Vec(IDL.Nat8),
    'highestExtra' : IDL.Vec(IDL.Nat8),
    'zero' : IDL.Nat8,
    'highest' : IDL.Vec(IDL.Nat8),
    'extra' : IDL.Vec(IDL.Nat8),
    'absoluteHighest' : IDL.Nat8,
    'legend' : IDL.Nat8,
  });
  const HttpHeader = IDL.Record({ 'value' : IDL.Text, 'name' : IDL.Text });
  const HttpResponsePayload = IDL.Record({
    'status' : IDL.Nat,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HttpHeader),
  });
  const TransformArgs = IDL.Record({
    'context' : IDL.Vec(IDL.Nat8),
    'response' : HttpResponsePayload,
  });
  const CanisterHttpResponsePayload = IDL.Record({
    'status' : IDL.Nat,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HttpHeader),
  });
  const ICDragon = IDL.Service({
    'alterHalving' : IDL.Func([IDL.Int], [IDL.Int], []),
    'blacklist' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'buy_ticket' : IDL.Func(
        [IDL.Nat, IDL.Nat, IDL.Nat],
        [BookTicketResult],
        [],
      ),
    'calculateRewards' : IDL.Func([], [IDL.Nat], []),
    'claimBonusPool' : IDL.Func([], [IDL.Bool], []),
    'claimReward' : IDL.Func([], [IDL.Bool], []),
    'createBaseAddress' : IDL.Func([], [], []),
    'deleteAlias' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'emergencySendEyes' : IDL.Func(
        [IDL.Principal, IDL.Nat],
        [TransferResult],
        [],
      ),
    'emgT' : IDL.Func([IDL.Nat, IDL.Principal], [TransferResult], []),
    'firstGame' : IDL.Func([], [IDL.Bool], []),
    'getAliasP' : IDL.Func([IDL.Text], [IDL.Principal], []),
    'getBalance' : IDL.Func(
        [IDL.Record({ 'te' : IDL.Vec(IDL.Nat8) })],
        [Tokens],
        [],
      ),
    'getCounter' : IDL.Func([], [IDL.Nat], ['query']),
    'getCurrentBonus' : IDL.Func([], [IDL.Nat], ['query']),
    'getCurrentGame' : IDL.Func([], [GameCheck], ['query']),
    'getCurrentIndex' : IDL.Func([], [IDL.Nat], ['query']),
    'getCurrentReward' : IDL.Func([], [IDL.Nat], ['query']),
    'getDevPool' : IDL.Func([], [IDL.Principal], ['query']),
    'getEyesDistribution' : IDL.Func([], [IDL.Nat], ['query']),
    'getGameByIndex' : IDL.Func([IDL.Nat], [GameCheck], ['query']),
    'getHalving' : IDL.Func([], [IDL.Nat], ['query']),
    'getHashDoubleRoll' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Nat)], ['query']),
    'getHashTicket' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Nat)], ['query']),
    'getList' : IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))], []),
    'getNextHalving' : IDL.Func([], [IDL.Int], ['query']),
    'getNextTicketPrice' : IDL.Func([], [IDL.Nat], ['query']),
    'getRewardPool' : IDL.Func([], [IDL.Principal], ['query']),
    'getTicketPrice' : IDL.Func([], [IDL.Nat], ['query']),
    'getTicketPurchaseHash' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(PaidTicketPurchase)))],
        ['query'],
      ),
    'getTimeNow' : IDL.Func([], [IDL.Int], ['query']),
    'getTimerStatus' : IDL.Func([], [IDL.Bool], ['query']),
    'getUserBets' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'ok' : IDL.Vec(Bet), 'none' : IDL.Nat })],
        [],
      ),
    'getUserByWallet' : IDL.Func([IDL.Text], [UserV2], []),
    'getUserData' : IDL.Func([], [UserV2], []),
    'getUserTicketList' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'initialEyesTokenCheck' : IDL.Func([], [IDL.Nat], []),
    'isMigrateable' : IDL.Func([IDL.Text], [Migrateable], []),
    'isNotPaused' : IDL.Func([], [IDL.Bool], ['query']),
    'manualUpdateEyes' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'migrate' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'pauseCanister' : IDL.Func([IDL.Bool], [IDL.Bool], []),
    'roll_dice' : IDL.Func([IDL.Nat], [DiceResult], []),
    'sendToDiscord' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'setAdmin' : IDL.Func([IDL.Principal], [IDL.Principal], []),
    'setCurrentMilestone' : IDL.Func([IDL.Nat], [IDL.Nat], []),
    'setDevPool' : IDL.Func([IDL.Principal], [IDL.Principal], []),
    'setEyesToken' : IDL.Func([IDL.Bool], [IDL.Bool], []),
    'setHalving' : IDL.Func([IDL.Nat], [IDL.Nat], []),
    'setNextTicketPrice' : IDL.Func([IDL.Nat], [IDL.Nat], []),
    'setRewardPool' : IDL.Func([IDL.Principal], [IDL.Principal], []),
    'setTicketPrice' : IDL.Func([IDL.Nat], [IDL.Nat], []),
    'startHalving' : IDL.Func([IDL.Int], [IDL.Nat], []),
    'syncFirstHash' : IDL.Func([], [IDL.Text, IDL.Nat], []),
    'testRoll' : IDL.Func([], [IDL.Nat8], []),
    'toText' : IDL.Func(
        [IDL.Record({ 'te' : IDL.Text })],
        [IDL.Vec(IDL.Nat8)],
        [],
      ),
    'transform' : IDL.Func(
        [TransformArgs],
        [CanisterHttpResponsePayload],
        ['query'],
      ),
    'whoCall' : IDL.Func([], [IDL.Principal], ['query']),
  });
  return ICDragon;
};
export const init = ({ IDL }) => { return []; };

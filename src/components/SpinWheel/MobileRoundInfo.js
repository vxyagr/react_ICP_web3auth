const MobileRoundInfo = ({ players, walletAddress, setConnectOpen, handleLogout, gameData }) => {
    return (
        <div className="xl:hidden order-3">
            <div className="h-[200px]" />
            <div className="fixed bottom-0 w-full z-30">
                <div className='bg-primary-gray rounded-lg p-4'>
                    <div className="text-lg font-bold mb-4">Round #18231</div>
                    <div className='flex flex-row justify-between items-center mb-4'>
                        <div className='flex flex-col justify-center items-start'>
                            <div className=" text-sm font-bold">{players.map(player => player.points).reduce((a, b) => a + b, 0)} $EYES</div>
                            <div className=" text-sm font-bold">Prize Pool</div>
                        </div>
                        <div className='flex flex-col justify-center items-start'>
                            <div className=" text-sm font-bold">300 $EYES</div>
                            <div className=" text-sm font-bold">My Entries</div>
                        </div>
                        <div className='flex flex-col justify-center items-end'>
                            <div className="text-sm font-bold">75%</div>
                            <div className=" text-sm font-bold">Win Chance</div>
                        </div>
                    </div>

                    {walletAddress ? (
                        <div>
                            {/* <BetInput /> */}
                            <button
                                onClick={() => {
                                    handleLogout();
                                }}
                                className="w-full py-2 rounded-md bg-dark-blue text-white font-bold text-lg bg-bright-red"
                            >
                                Disconnect
                            </button>
                            {walletAddress ? "wallet address : " + walletAddress : ""}
                            <br />
                            {walletAddress ? "game data : " + gameData.toString() : ""}
                        </div>
                    ) : (
                        <div>
                            <button
                                onClick={() => {
                                    setConnectOpen(true);
                                }}
                                className="w-full py-2 rounded-md bg-dark-blue text-white font-bold text-lg bg-bright-red"
                            >
                                Connect Wallet to Play
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileRoundInfo;

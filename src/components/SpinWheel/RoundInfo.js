import React from 'react';
import BetInput from './BetInput';

const RoundInfo = ({ players, walletAddress, setConnectOpen, handleLogout, gameData }) => {
    return (
        <section id="player-data" className="hidden xl:block z-20 w-1/3 text-dark-blue justify-start items-start h-full py-6 order-3 xl:order-3 ">
            <div className='bg-primary-gray rounded-lg p-4'>
                <div className="text-xl font-bold mb-4">Round #18231</div>
                <div className='flex flex-row justify-between items-center mb-4'>
                    <div className='flex flex-col justify-center items-start'>
                        <div className=" text-xl font-bold">{players.map(player => player.points).reduce((a, b) => a + b, 0)} $EYES</div>
                        <div className=" text-sm font-bold">Prize Pool</div>
                    </div>
                    <div className='flex flex-col justify-center items-end'>
                        <div className=" text-xl font-bold">{players.length}/100</div>
                        <div className=" text-sm font-bold">Players</div>
                    </div>
                </div>

                {walletAddress ? (
                    <div>
                        <div className='flex flex-row justify-between items-center mb-4'>
                            <div className='flex flex-col justify-center items-start'>
                                <div className=" text-xl font-bold">300 $EYES</div>
                                <div className=" text-sm font-bold">My Entries</div>
                            </div>
                            <div className='flex flex-col justify-center items-end'>
                                <div className="text-xl font-bold">75%</div>
                                <div className=" text-sm font-bold">Win Chance</div>
                            </div>
                        </div>
                        <BetInput />
                        <button
                            onClick={() => {
                                handleLogout();
                            }}
                            className="w-full mt-4 py-2 rounded-md text-white font-bold text-lg bg-bright-red"
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
                            className="w-full py-2 rounded-md text-white font-bold text-lg bg-bright-red"
                        >
                            Connect Wallet to Play
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default RoundInfo;
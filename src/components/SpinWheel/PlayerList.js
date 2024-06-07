import React from 'react';
import CountdownTimer from './CountdownTimer';

const images = require.context('../../assets/weapons', false, /\.png$/);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const PlayerWeaponImage = ({ player }) => {
    const randomNum = getRandomInt(1, 18);
    const imageName = `weapon_${randomNum}_${player.id}.png`; ///TODO BY BASE EYES

    // Dynamically select the image from the imported context
    const imageSrc = images(`./${imageName}`);

    return <img src={imageSrc} alt="Player Weapon" className="w-10 h-10" />;
};


const PlayerList = ({ players }) => {
    return (
        <div className="w-full xl:w-1/3 text-dark-blue h-full p-6 order-2 xl:order-1 z-20">
            <div className='bg-primary-gray rounded-lg p-2 flex flex-row justify-between items-center mb-4'>
                <div className=" text-2xl font-bold">Player List</div>
                <CountdownTimer unixTime={new Date().getTime() + (1000 * 60)} />
            </div>
            <ul className="space-y-4 h-[680px] overflow-y-scroll scrollbar">
                {players.map(player => (
                    <li key={player.id} className="flex items-center bg-primary-gray rounded-lg mr-2 h-32">
                        <div className='flex w-full items-center p-4'>
                            <PlayerWeaponImage player={player} />
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold">{player.name}</h2>
                                <p className="">Bet: {player.points} $EYES</p>
                                <p className="">Win Chance: {player.winChance}</p>
                            </div>
                        </div>
                        <div className="w-6 h-full rounded-r-lg" style={{ backgroundColor: player.bg }} />
                    </li>
                ))}
            </ul>
            <div className='bg-primary-gray rounded-lg p-2 flex flex-row justify-between items-center mt-4'>
                <div className=" text-2xl font-bold">Prize Pool:</div>
                <div className=" text-2xl font-bold">{players.map(player => player.points).reduce((a, b) => a + b, 0)} $EYES</div>
            </div>
        </div>
    );
};

export default PlayerList;

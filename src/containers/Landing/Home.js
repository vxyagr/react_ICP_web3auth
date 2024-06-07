import PlayerList from '../../components/SpinWheel/PlayerList';
import SpinWheel from '../../components/SpinWheel/SpinWheel';
import RoundInfo from '../../components/SpinWheel/RoundInfo';
import MobileRoundInfo from "../../components/SpinWheel/MobileRoundInfo";

import DragonBackground from "../../assets/spin_wheel/dragon.webp";


const players = [
    { id: 1, icon: '🏀', name: 'Player One', points: 300, winChance: '75%', bg: 'rgb(255, 99, 132)' },
    { id: 2, icon: '⚽', name: 'Player Two', points: 50, winChance: '60%', bg: 'rgb(54, 162, 0)' },
    { id: 3, icon: '🎾', name: 'Player Three', points: 100, winChance: '80%', bg: 'rgb(54, 23, 235)' },
    { id: 4, icon: '🏈', name: 'Player Four', points: 200, winChance: '90%', bg: 'rgb(0, 99, 2)' },
    { id: 5, icon: '⚾', name: 'Player Five', points: 400, winChance: '95%', bg: 'rgb(54, 12, 0)' },
    { id: 6, icon: '🏉', name: 'Player Six', points: 500, winChance: '100%', bg: 'rgb(122, 0, 235)' },
    { id: 7, icon: '🏓', name: 'Player Seven', points: 1000, winChance: '100%', bg: 'rgb(1, 99, 132)' },
];

const HomePage = ({ walletAddress, setConnectOpen, handleLogout, gameData }) => {
    return (
        <div className="bg-[url('../../assets/spin_wheel/background.webp')] bg-cover min-h-screen relative">
            <div className="flex h-full xl:h-[860px] mx-auto max-w-7xl flex flex-col justify-center items-start gap-0 xl:gap-12 xl:flex-row">
                <PlayerList players={players} />
                <SpinWheel players={players} />
                <RoundInfo players={players} walletAddress={walletAddress} setConnectOpen={setConnectOpen} handleLogout={handleLogout} gameData={gameData} />
                <MobileRoundInfo players={players} walletAddress={walletAddress} setConnectOpen={setConnectOpen} handleLogout={handleLogout} gameData={gameData} />
            </div>
            <img src={DragonBackground} className="z-10 rounded-lg w-full absolute bottom-0 right-0 hidden lg:block lg:w-4/12 2xl:w-2/6" alt="dragon-bg" />
        </div >
    );
}

export default HomePage;
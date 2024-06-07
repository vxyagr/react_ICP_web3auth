import React from 'react';
import DragonBackground from "../../assets/spin_wheel/dragon.webp";

import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
  const navigate = useNavigate();
  const results = [
    {
      round: 58014,
      winner: '9C02C6',
      prizePool: '0.62',
      winnerEntries: '0.3',
      winPercentage: '48.39%',
      win: '2.07x',
      players: 5,
      finishTime: '14:58, May. 27, 2024',
    },
    {
      round: 58013,
      winner: 'e72C35',
      prizePool: '0.55',
      winnerEntries: '0.3',
      winPercentage: '54.55%',
      win: '1.83x',
      players: 7,
      finishTime: '14:56, May. 27, 2024',
    },
    {
      round: 58013,
      winner: 'e72C35',
      prizePool: '0.55',
      winnerEntries: '0.3',
      winPercentage: '54.55%',
      win: '1.83x',
      players: 7,
      finishTime: '14:56, May. 27, 2024',
    },
    {
      round: 58013,
      winner: 'e72C35',
      prizePool: '0.55',
      winnerEntries: '0.3',
      winPercentage: '54.55%',
      win: '1.83x',
      players: 7,
      finishTime: '14:56, May. 27, 2024',
    },
    {
      round: 58013,
      winner: 'e72C35',
      prizePool: '0.55',
      winnerEntries: '0.3',
      winPercentage: '54.55%',
      win: '1.83x',
      players: 7,
      finishTime: '14:56, May. 27, 2024',
    },
    {
      round: 58013,
      winner: 'e72C35',
      prizePool: '0.55',
      winnerEntries: '0.3',
      winPercentage: '54.55%',
      win: '1.83x',
      players: 7,
      finishTime: '14:56, May. 27, 2024',
    },
    {
      round: 58013,
      winner: 'e72C35',
      prizePool: '0.55',
      winnerEntries: '0.3',
      winPercentage: '54.55%',
      win: '1.83x',
      players: 7,
      finishTime: '14:56, May. 27, 2024',
    },
    {
      round: 58013,
      winner: 'e72C35',
      prizePool: '0.55',
      winnerEntries: '0.3',
      winPercentage: '54.55%',
      win: '1.83x',
      players: 7,
      finishTime: '14:56, May. 27, 2024',
    },
    {
      round: 58013,
      winner: 'e72C35',
      prizePool: '0.55',
      winnerEntries: '0.3',
      winPercentage: '54.55%',
      win: '1.83x',
      players: 7,
      finishTime: '14:56, May. 27, 2024',
    },
    {
      round: 58013,
      winner: 'e72C35',
      prizePool: '0.55',
      winnerEntries: '0.3',
      winPercentage: '54.55%',
      win: '1.83x',
      players: 7,
      finishTime: '14:56, May. 27, 2024',
    },
    {
      round: 58013,
      winner: 'e72C35',
      prizePool: '0.55',
      winnerEntries: '0.3',
      winPercentage: '54.55%',
      win: '1.83x',
      players: 7,
      finishTime: '14:56, May. 27, 2024',
    },
    // Add more entries as needed
  ];

  const handleBack = () => {
    navigate("/")
  };

  return (
    <div className="bg-[url('../../assets/spin_wheel/background.webp')] bg-cover min-h-screen relative p-16">
      <div className="max-w-7xl mx-auto relative z-20">
        <div className="flex justify-between items-center mb-4">
          <button onClick={handleBack} className="space-x-2 px-4 py-2 bg-dark-blue text-white rounded flex flex-row justify-center items-center">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            <div className="">Current Round</div>
          </button>
          <button className="px-4 py-2 bg-dark-blue text-white rounded">
            Connect
          </button>
        </div>
        <div className="flex space-x-4 mb-4">
          <button className="px-4 py-2 bg-primary-gray text-dark-blue rounded">All</button>
          <button className="px-4 py-2 bg-primary-gray text-dark-blue rounded">Completed</button>
          <button className="px-4 py-2 bg-primary-gray text-dark-blue rounded">Canceled</button>
        </div>
        <div className="overflow-x-auto max-h-[600px] overflow-y-scroll scrollbar">
          <table className="w-full bg-primary-gray rounded">
            <thead>
              <tr className="text-left border-b border-dark-blue">
                <th className="p-4">Round</th>
                <th className="p-4">Winner</th>
                <th className="p-4">Prize Pool</th>
                <th className="p-4">Winner's Entries</th>
                <th className="p-4">Win</th>
                <th className="p-4">Your Entries</th>
                <th className="p-4">Players</th>
                <th className="p-4">Finish</th>
                <th className="p-4">Verify</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className="border-b border-primary-gray">
                  <td className="p-4">{result.round}</td>
                  <td className="p-4 flex items-center">
                    <div className="w-8 h-8 bg-gray-400 rounded-full mr-2"></div>
                    {result.winner}
                  </td>
                  <td className="p-4">{result.prizePool}</td>
                  <td className="p-4">{result.winnerEntries} <span className="text-dark-blue">({result.winPercentage})</span></td>
                  <td className="p-4">{result.win}</td>
                  <td className="p-4">-</td>
                  <td className="p-4">{result.players}</td>
                  <td className="p-4">{result.finishTime}</td>
                  <td className="p-4">
                    <div className="cursor-pointer w-5 h-5" onClick={() => window.open(`https://etherscan.io/address/${result.winner}`)}>
                      <svg className="w-5 h-5" viewBox="0 0 32 32" focusable="false" class="chakra-icon css-1duu6o0" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M26 28H6C4.89543 28 4 27.1046 4 26V6C4 4.89543 4.89543 4 6 4H15V6H6V26H26V17H28V26C28 27.1046 27.1046 28 26 28ZM21 2V4H26.59L18 12.59L19.41 14L28 5.41V11H30V2H21Z" fill="currentColor"></path></svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <img src={DragonBackground} className="z-0 rounded-lg w-full absolute bottom-0 right-0 hidden lg:block lg:w-4/12 2xl:w-2/6" />
    </div>
  );
};

export default HistoryPage;

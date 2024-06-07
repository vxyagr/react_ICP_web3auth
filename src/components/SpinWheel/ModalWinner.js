// Modal.js
import React from 'react';

const ModalWinner = ({ isVisible, onClose, winnerUsername, prizePool }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 text-white">
            <div className="rounded-2xl bg-dark-blue lg:bg-opacity-85 w-full max-w-md p-4 md:p-8 rounded-2xl">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h1 className="text-xl flex-grow text-center">The dragon has been slain</h1>
                    <button onClick={onClose} className="text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="flex items-center mb-4">
                    <div className="w-16 h-16 flex-shrink-0">
                        {/* Placeholder for Weapon Icon */}
                        <img src="/icons/icon_1.png" alt="Weapon Icon" className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4">
                        <p className="text-lg font-bold text-red-500">{winnerUsername}'s Party!</p>
                        <p>{winnerUsername}'s Party has found {prizePool} worth of treasure in the dragon's den!</p>
                    </div>
                </div>
                <div className="w-full bg-gray-300 h-64">
                    {/* Placeholder for Treasure Chest Image */}
                    <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f6b26bf8-fc77-4d53-b07b-98886e7d5a59/de5jc4k-7162b499-2f32-4e84-941c-cd13450a2ea3.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2Y2YjI2YmY4LWZjNzctNGQ1My1iMDdiLTk4ODg2ZTdkNWE1OVwvZGU1amM0ay03MTYyYjQ5OS0yZjMyLTRlODQtOTQxYy1jZDEzNDUwYTJlYTMuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.l3gD6ZMbphgpk8kVJsslqAbZ2dXZ86VvOST78sRn_fk" alt="Treasure Chest" className="w-full h-full object-cover object-bottom" />
                </div>
            </div>
        </div>
    );
};

export default ModalWinner;

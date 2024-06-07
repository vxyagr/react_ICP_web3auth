import React, { useState } from 'react'

function BetInput() {
    const [valuePerRound, setValuePerRound] = useState([100, 500, 1000])
    const [selectedValue, setSelectedValue] = useState(valuePerRound[0])
    const [totalEntry, setTotalEntry] = useState(selectedValue) // Initial total entry based on selectedValue

    const handleChangeValuePerRound = (value, index) => {
        const newValuePerRound = [...valuePerRound]
        newValuePerRound[index] = value
        setValuePerRound(newValuePerRound)
        setSelectedValue(value)
        setTotalEntry(value) // Update totalEntry based on selectedValue
    }

    const handleTotalEntryChange = (event) => {
        // Validate and update totalEntry based on user input
        const newTotalEntry = parseFloat(event.target.value);
        if (!isNaN(newTotalEntry) && newTotalEntry >= 0) {
            setTotalEntry(newTotalEntry);
        } else {
            // Handle invalid input (e.g., show error message)
            console.error('Invalid total entry value:', event.target.value);
        }
    }

    const handleAddSelection = () => {
        // Add functionality to add more selections here with the totalEntry value
        console.log('Add selection clicked! Total Entry:', totalEntry)
    }

    return (
        <div className="">
            <div className="flex mb-4 items-center">
                <p className="text-right mr-4 w-1/3">$EYES in Wallet:</p>
                <input type="text" className="flex-1 rounded-md border border-gray-300 px-3 py-2" value="10000 $EYES" disabled />
            </div>
            <div className="flex mb-4 items-center">
                <p className="text-right mr-4 w-1/3">Total Entry:</p>
                <input type="text" id="totalEntryInput" className="flex-1 rounded-md border border-gray-300 px-3 py-2" onChange={handleTotalEntryChange} value={totalEntry} />
            </div>
            <div className="flex justify-between mb-4">
                {valuePerRound.map((value, index) => (
                    <button
                        key={index}
                        className={`px-3 py-2 rounded-md mr-2 bg-gray-200 text-gray-700 hover:bg-dark-blue hover:text-white`}
                        onClick={() => handleChangeValuePerRound(value, index)}
                    >
                        {value} $EYES
                    </button>
                ))}
            </div>
            <hr />
            <button className="w-full mt-4 py-2 rounded-md bg-dark-blue text-white font-bold text-lg" onClick={handleAddSelection}>
                Submit Bet
            </button>
        </div>
    )
}

export default BetInput

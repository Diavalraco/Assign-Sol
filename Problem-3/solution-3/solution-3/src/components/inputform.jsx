import React, { useState } from 'react';

function InputForm({ onFindPaths }) {
    const [soldiers, setSoldiers] = useState([]);
    const [castle, setCastle] = useState({ x: 1, y: 1 });

    const handleSubmit = (event) => {
        event.preventDefault();
        onFindPaths(soldiers, castle);
    };

    const handleSoldierChange = (event, index) => {
        const newSoldiers = [...soldiers];
        newSoldiers[index] = { x: parseInt(event.target.value.split(',')[0]), y: parseInt(event.target.value.split(',')[1]) };
        setSoldiers(newSoldiers);
    };

    const addSoldier = () => {
        setSoldiers([...soldiers, { x: 1, y: 1 }]);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Enter Soldier Positions</h2>
            {soldiers.map((s, index) => (
                <div key={index}>
                    <label>Soldier {index + 1}: </label>
                    <input
                        type="text"
                        value={`${s.x},${s.y}`}
                        onChange={(e) => handleSoldierChange(e, index)}
                    />
                </div>
            ))}
            <button type="button" onClick={addSoldier}>Add Soldier</button>
            <h2>Enter Castle Position</h2>
            <label>Castle: </label>
            <input
                type="text"
                value={`${castle.x},${castle.y}`}
                onChange={(e) => setCastle({ x: parseInt(e.target.value.split(',')[0]), y: parseInt(e.target.value.split(',')[1]) })}
            />
            <button type="submit">Find Paths</button>
        </form>
    );
}

export default InputForm;

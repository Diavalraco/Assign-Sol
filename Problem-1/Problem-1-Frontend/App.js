import React, { useState } from 'react';
import axios from 'axios';
import { XYPlot, LineSeries, MarkSeries } from 'react-vis';

function App() {
    const [flights, setFlights] = useState({});
    const [adjustedFlights, setAdjustedFlights] = useState(null);
    const [newFlight, setNewFlight] = useState({ name: '', coordinates: '' });

    const handleAddFlight = () => {
        if (!newFlight.name || !newFlight.coordinates) {
            alert('Please provide a flight name and coordinates.');
            return;
        }

        const coordinates = newFlight.coordinates.split(' ').map(coord => {
            const [x, y] = coord.split(',').map(Number);
            return [x, y];
        });

        setFlights(prevFlights => ({
            ...prevFlights,
            [newFlight.name]: coordinates
        }));

        setNewFlight({ name: '', coordinates: '' });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:5000/adjust-paths', { flights });
            setAdjustedFlights(response.data.adjustedFlights);
        } catch (error) {
            console.error('Error adjusting paths:', error);
        }
    };

    const renderPaths = (flightData) => {
        return Object.keys(flightData).map((flight, index) => {
            const path = flightData[flight].map(([x, y]) => ({ x, y }));
            return (
                <LineSeries
                    key={flight}
                    data={path}
                    style={{
                        stroke: `hsl(${index * 60}, 100%, 50%)`,
                        strokeWidth: 2
                    }}
                />
            );
        });
    };

    const renderPoints = (flightData) => {
        return Object.keys(flightData).map((flight, index) => {
            const points = flightData[flight].map(([x, y]) => ({ x, y }));
            return (
                <MarkSeries
                    key={`${flight}-points`}
                    data={points}
                    color={`hsl(${index * 60}, 100%, 50%)`}
                />
            );
        });
    };

    return (
        <div>
            <h1>Flight Paths</h1>
            <div>
                <h2>Add New Flight</h2>
                <input
                    type="text"
                    placeholder="Flight Name"
                    value={newFlight.name}
                    onChange={(e) => setNewFlight({ ...newFlight, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Coordinates (e.g., 1,1 2,2 3,3)"
                    value={newFlight.coordinates}
                    onChange={(e) => setNewFlight({ ...newFlight, coordinates: e.target.value })}
                />
                <button onClick={handleAddFlight}>Add Flight</button>
            </div>
            <button onClick={handleSubmit}>Adjust Flight Paths</button>
            {Object.keys(flights).length > 0 && (
                <div>
                    <h2>Original Paths</h2>
                    <XYPlot width={500} height={500}>
                        {renderPaths(flights)}
                        {renderPoints(flights)}
                    </XYPlot>
                </div>
            )}
            {adjustedFlights && (
                <div>
                    <h2>Adjusted Paths</h2>
                    <XYPlot width={500} height={500}>
                        {renderPaths(adjustedFlights)}
                        {renderPoints(adjustedFlights)}
                    </XYPlot>
                </div>
            )}
        </div>
    );
}

export default App;

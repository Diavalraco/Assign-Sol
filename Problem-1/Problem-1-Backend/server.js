const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

function checkIntersection(path1, path2) {
    for (let i = 0; i < path1.length - 1; i++) {
        for (let j = 0; j < path2.length - 1; j++) {
            const intersect = doIntersect(path1[i], path1[i + 1], path2[j], path2[j + 1]);
            if (intersect) {
                return true;
            }
        }
    }
    return false;
}

function doIntersect(p1, q1, p2, q2) {
    const orientation = (p, q, r) => {
        const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
        if (val === 0) return 0;
        return (val > 0) ? 1 : 2;
    };

    const o1 = orientation(p1, q1, p2);
    const o2 = orientation(p1, q1, q2);
    const o3 = orientation(p2, q2, p1);
    const o4 = orientation(p2, q2, q1);

    if (o1 !== o2 && o3 !== o4) return true;

    return false;
}

function adjustPath(path, adjustment) {
    return path.map(([x, y]) => [x + adjustment, y + adjustment]);
}

function ensureNoIntersection(flights) {
    const adjustedFlights = {};
    const adjustments = {};

    const flightKeys = Object.keys(flights);
    for (let i = 0; i < flightKeys.length; i++) {
        const flight1 = flightKeys[i];
        adjustedFlights[flight1] = flights[flight1];
        adjustments[flight1] = 0;
        for (let j = 0; j < i; j++) {
            const flight2 = flightKeys[j];
            while (checkIntersection(adjustedFlights[flight1], adjustedFlights[flight2])) {
                adjustments[flight1]++;
                adjustedFlights[flight1] = adjustPath(flights[flight1], adjustments[flight1]);
            }
        }
    }
    return adjustedFlights;
}

app.post('/adjust-paths', (req, res) => {
    const { flights } = req.body;
    const adjustedFlights = ensureNoIntersection(flights);
    res.json({ adjustedFlights });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

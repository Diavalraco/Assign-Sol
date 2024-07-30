import React from 'react';

function PathDisplay({ paths }) {
    if (paths.length === 0) return <p>No paths found</p>;

    return (
        <div>
            <h2>Paths Found</h2>
            {paths.map((path, index) => (
                <div key={index}>
                    <h3>Path {index + 1}</h3>
                    <ul>
                        {path.map((step, i) => (
                            <li key={i}>Kill ({step.x},{step.y})</li>
                        ))}
                        <li>Arrive at ({path[0].x},{path[0].y})</li>
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default PathDisplay;

import React, { useState } from 'react';
import InputForm from './components/inputform';
import PathDisplay from './components/PathDisplay';

function App() {
    const [paths, setPaths] = useState([]);

    const handleFindPaths = (soldiers, castle) => {
        const allPaths = findPaths(castle, soldiers);
        setPaths(allPaths);
    };

    const findPaths = (castle, soldiers) => {
        const directions = [
            { x: 1, y: 0 }, 
            { x: 0, y: 1 }, 
            { x: -1, y: 0 }, 
            { x: 0, y: -1 }
        ];

        const turnLeft = (dir) => {
            return directions[(directions.indexOf(dir) + 3) % 4];
        };

        let allPaths = [];

        function isInBounds(x, y) {
            return x >= 1 && x <= 8 && y >= 1 && y <= 8;
        }

        function isOccupied(x, y, soldiers) {
            return soldiers.some(s => s.x === x && s.y === y);
        }

        function findPathsRecursive(start, soldiers, currentPath, currentDir) {
          if (soldiers.length === 0 && start.x === castle.x && start.y === castle.y) {
            allPaths.push([...currentPath]);
            return;
          }
        
          const dirOffsets = directions.slice();
          if (currentDir) {
            const dirIndex = directions.indexOf(currentDir);
            dirOffsets.push(...dirOffsets.splice(0, dirIndex)); 
          }
        
          for (const offset of dirOffsets) {
            let x = start.x;
            let y = start.y;
            let newSoldiers = [...soldiers]; 
            let foundPath = false;
        
            while (true) {
              x += offset.x;
              y += offset.y;
        
              if (!isInBounds(x, y)) break;
        
              const soldierIndex = soldiers.findIndex(s => s.x === x && s.y === y);
              if (soldierIndex !== -1) { 
                foundPath = true;
                newSoldiers.splice(soldierIndex, 1); 
                currentPath.push({ x, y });
                findPathsRecursive({ x, y }, newSoldiers, currentPath, turnLeft(offset));
                currentPath.pop(); 
              } else if (isOccupied(x, y, soldiers)) { 
                break;
              }
            }
        
            if (!foundPath) break;
          }
        }
        
    
        findPathsRecursive(castle, soldiers, [], directions[0]);
        return allPaths;
    };

    return (
        <div className="App">
            <h1>Castle Game</h1>
            <InputForm onFindPaths={handleFindPaths} />
            <PathDisplay paths={paths} />
        </div>
    );
}

export default App;

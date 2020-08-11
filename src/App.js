import React, { useReducer } from 'react';

const reducer = (state, action) => {

    switch (action.type) {

        case 'PLAYER_MOVE': {
            if (state.game === 'won') {return state;} // do nothing if game is won
            const {x, y} = action.payload;
            console.log({x, y});
            const {grid, turn} = state;
            const nextState = cloneObj(state);

            if (grid[y][x]) {return state;} // already clicked square should have no effect
            nextState.grid[y][x] = turn; // use 'turn' for player mark placement
            const flatGrid = flatArrays(nextState.grid); // more easily checked as an array
            if (checkBoard(flatGrid)) {nextState.game = 'won'; return nextState;} // check the board for a win

            nextState.turn = PLAYER[turn];
            return nextState
        }

        default:
            return state;
    }
};

const generateGrid = () => [[null, null, null], [null, null, null], [null, null, null]];
const getInitialState = () => ({grid: generateGrid(), turn: 'X', game: 'playing'})


function App() {

    const [state, dispatch] = useReducer(
        reducer,
        getInitialState()
    );
    const playerMove = (x, y) => {
        console.log(x, y);
        dispatch({type: 'PLAYER_MOVE', payload: {x, y}})
    };
    const {grid, game, turn} = state;

    return (
        <div className="App" style={{textAlign: 'center'}}>
            <Grid grid={grid} playerMove={playerMove}/>
            {game === 'won' && <h1 style={{color: '#33f', fontSize: '40px'}}>{turn} is victorious!</h1>}
        </div>
    );
}

function Grid({grid, playerMove}) {
    return (
        <div style={{display: 'inline-block'}}>
            <div style={{
                backgroundColor: '#777',
                display: 'grid',
                gridGap: 1,
                gridTemplateRows: `repeat(${grid.length}, 1fr)`,
                gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
            }}>

                {grid.map(
                    (row, rowIndex) => row.map(
                        (column, columnIndex) => (
                            <Square key={`${columnIndex}/${rowIndex}`} value={column}
                                    playerMove={() => playerMove(columnIndex, rowIndex)}/>
                        )))}
            </div>
        </div>

    )
}

function Square({value, playerMove}) {
    return (
        <div>
            <button type='button'
                    style={{height: 200, width: 200}}
                    onClick={playerMove}
            >
                {value}
            </button>
        </div>
    )
}

const cloneObj = x => JSON.parse(JSON.stringify(x));
const flatArrays = arr => arr.reduce((acc, cur) => [...acc, ...cur], []);
const PLAYER = {
    O: 'X',
    X: 'O'
};
function threeSquares (a, b, c) {
    if (!a || !b || !c) return false; return a===b && b===c; // three squares should be equal in each combination
}

function checkBoard(flatGrid) { // all possible combinations
    const [topLeft, top, topRight, left, center, right, bottomLeft, bottom, bottomRight] = flatGrid;
    return (
        threeSquares(topLeft, top, topRight) ||
        threeSquares(left, center, right) ||
        threeSquares(bottomLeft, bottom, bottomRight) ||
        threeSquares(topLeft, left, bottomLeft) ||
        threeSquares(top, center, bottom) ||
        threeSquares(topRight, right, bottomRight) ||
        threeSquares(topLeft, center, bottomRight) ||
        threeSquares(bottomLeft, center, topRight)
    )
}

export default App;
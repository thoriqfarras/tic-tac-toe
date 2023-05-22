function Cell() {
    let value = ' ';

    const fill = (symbol) => value = symbol;
    const reset = () => value = ' ';
    const getValue = () => value;

    return {fill, getValue, reset};
}

function Gameboard() {
    let board = [];
    for (let i = 0; i < 9; i++) {
        board.push(Cell());
    }

    const getBoard = () => board;

    const fill = (index, symbol) => {
        if (board[index].getValue() !== ' ') return `${index} is filled.`;

        board[index].fill(symbol);
    }

    const reset = () => {
        board.forEach(cell => cell.reset());
    };

    const print = () => {
        console.log(`${board[0].getValue()} | ${board[1].getValue()} | ${board[2].getValue()}`);
        console.log(`${board[3].getValue()} | ${board[4].getValue()} | ${board[5].getValue()}`);
        console.log(`${board[6].getValue()} | ${board[7].getValue()} | ${board[8].getValue()}`);
    };

    return {getBoard, fill, print, reset};
}

function GameController(
    playerOneName = 'Player One', 
    playerTwoName = 'Player Two'
) {
    const board = Gameboard();

    const players = [{
        name: playerOneName,
        symbol: 'X'
    }, 
    {
        name: playerTwoName,
        symbol: 'O'
    }];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.print();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (index) => {
        console.log(`${getActivePlayer().name} filled the ${index}-th index.`);
        board.fill(index, getActivePlayer().symbol);

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return { playRound, getActivePlayer };

}

const game = GameController();
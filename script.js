function Cell() {
    let value = ' ';

    const fill = (symbol) => value = symbol;
    const reset = () => value = ' ';
    const getValue = () => value;

    return {fill, getValue, reset};
}

function Gameboard() {
    let board = [];
    let line = [];
    for (let i = 0; i < 9; i++) {
        board.push(Cell());
    }

    const getBoard = () => board;

    const fill = (index, symbol) => {
        if (board[index].getValue() !== ' ') return `${index} is filled.`;

        board[index].fill(symbol);
    };

    const checkWin = (symbol) => {
        if (checkStraightLine(symbol)) return true;
        if (checkDiagonalLine(symbol)) return true;
        return false;
    };

    const getLine = () => line;

    const checkStraightLine = (symbol) => {
        const values = board.map(cell => cell.getValue());
        
        // check for horizontal lines
        if (
            values[0] === symbol && 
            values[1] === symbol &&
            values[2] === symbol
        ) {
            line = [0, 1, 2]
            return true;
        }

        if (
            values[3] === symbol && 
            values[4] === symbol &&
            values[5] === symbol
        ) {
            line = [3, 4, 5];
            return true;
        }
        
        if (
            values[6] === symbol && 
            values[7] === symbol &&
            values[8] === symbol
        ) {
            line = [6, 7, 8];
            return true;
        }

        // check for vertical lines
        if (
            values[0] === symbol && 
            values[3] === symbol &&
            values[6] === symbol
        ) {
            line = [0, 3, 6]
            return true;
        }

        if (
            values[1] === symbol && 
            values[4] === symbol &&
            values[7] === symbol
        ) {
            line = [1, 4, 7];
            return true;
        }

        if (
            values[2] === symbol && 
            values[5] === symbol &&
            values[8] === symbol
        ) {
            line = [2, 5, 8];
            return true;
        }
        
        return false;
    };

    const checkDiagonalLine = (symbol) => {
        const values = board.map(cell => cell.getValue());
        
        if (
            values[0] === symbol && 
            values[4] === symbol &&
            values[8] === symbol
        ) {
            line = [0, 4, 8];
            return true;
        }

        if (
            values[2] === symbol && 
            values[4] === symbol &&
            values[6] === symbol
        ) {
            line = [2, 4, 6];
            return true;
        }

        return false;
    };

    const isFull = () => {
        const values = board.map(cell => cell.getValue());
        return !values.includes(' ');
    };

    const reset = () => {
        board.forEach(cell => cell.reset());
        line = [];
    };

    const print = () => {
        console.log(`${board[0].getValue()} | ${board[1].getValue()} | ${board[2].getValue()}`);
        console.log(`${board[3].getValue()} | ${board[4].getValue()} | ${board[5].getValue()}`);
        console.log(`${board[6].getValue()} | ${board[7].getValue()} | ${board[8].getValue()}`);
    };

    return {getBoard, fill, print, reset, checkWin, isFull, getLine};
}

function GameController(
    playerOneName = 'Player One', 
    playerTwoName = 'Player Two'
) {
    const board = Gameboard();
    let running = true;

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

    const isRunning = () => running;

    const getActivePlayer = () => activePlayer;

    const resetGame = () => {
        board.reset();
        running = true;
        activePlayer = players[0];
    };


    const printNewRound = () => {
        board.print();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (index) => {
        const symbol = activePlayer.symbol;
        const result = board.fill(index, getActivePlayer().symbol);

        // check for duplicate attempt
        if (result) {
            console.log(result);
            console.log(`${activePlayer.name}'s turn.`);
            return;
        }

        // check for win
        if (board.checkWin(symbol)) {
            board.print();
            console.log(`${activePlayer.name} won!`);
            running = false;
            return 'win';
        }

        // check for draw
        if (board.isFull()) {
            board.print();
            console.log('It\'s a draw!');
            running = false;
            return 'draw';
        }

        console.log(`${getActivePlayer().name} filled the ${index}-th index.`);

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return { 
        playRound, 
        getActivePlayer, 
        getBoard: board.getBoard, 
        isRunning,
        resetGame,
        getLine: board.getLine
    };
}

function ScreenController() {
    const circleIcon = 'assets/circle-outline.svg';
    const crossIcon = 'assets/window-close.svg';

    const game = GameController();
    const prompt = document.querySelector('.prompt');
    const boardDiv = document.querySelector('.grid');
    const resetButton = document.querySelector('.reset');

    const updateScreen = (result) => {

        if (result === 'reset') {
            game.resetGame();
        }
        
        // remove all cells
        while (boardDiv.firstChild) {
            boardDiv.removeChild(boardDiv.firstChild);
        }

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // render all cells
        board.forEach((cell, index) => {
            const cellButton = document.createElement('button');
            cellButton.setAttribute('type', 'button');
            cellButton.classList.add('cell');
            cellButton.dataset.index = index;
            
            const value = cell.getValue();
            if (value !== ' ') {
                drawSymbol(value, cellButton);
            }
            boardDiv.appendChild(cellButton);
        });
        
        if (result === 'win') {
            prompt.textContent = `${activePlayer.name} won!`;
            const line = game.getLine();
            highlightLine(line);
        } else if (result === 'draw') {
            prompt.textContent = "It's a draw!";
        } else {
            prompt.textContent = `${activePlayer.name}'s turn...`;
        }
    };
    
    const clickHandlerBoard = e => {
        if (game.isRunning()) {
            const selectedCell = e.target.dataset.index;
            const result = game.playRound(selectedCell);
            updateScreen(result);
        }
    };

    const clickHandlerReset = e => {
        const result = e.target.className;
        updateScreen(result);
    };

    const drawSymbol = (value, cell) => {
        const symbol = document.createElement('img');
        if (value === 'X') {
            symbol.setAttribute('src', crossIcon);
        } else if (value === 'O') {
            symbol.setAttribute('src', circleIcon);
        }
        cell.appendChild(symbol);
    };

    const highlightLine = (line) => {
        const cells = document.querySelectorAll('.cell');
        console.log(line);
        cells.forEach((cell, index) => {
            if (line.includes(index)) {
                cell.classList.toggle('highlight');
            }
        });    
    };

    boardDiv.addEventListener('click', clickHandlerBoard);
    resetButton.addEventListener('click', clickHandlerReset);
    updateScreen();
}

ScreenController();
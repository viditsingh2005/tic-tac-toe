// ==========================================
// GET ELEMENTS
// ==========================================

const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("status");

const resultText = document.getElementById("result");

const resetBtn = document.getElementById("resetBtn");

const playerModeBtn =
    document.getElementById("playerMode");

const aiModeBtn =
    document.getElementById("aiMode");

const xScoreElement =
    document.getElementById("xScore");

const oScoreElement =
    document.getElementById("oScore");

const drawScoreElement =
    document.getElementById("drawScore");


// ==========================================
// GAME VARIABLES
// ==========================================

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];

let currentPlayer = "X";

let gameOver = false;

let vsAI = false;


// Scores

let xScore = 0;

let oScore = 0;

let drawScore = 0;


// ==========================================
// WINNING COMBINATIONS
// ==========================================

const winningCombinations = [

    [0, 1, 2],

    [3, 4, 5],

    [6, 7, 8],

    [0, 3, 6],

    [1, 4, 7],

    [2, 5, 8],

    [0, 4, 8],

    [2, 4, 6]

];


// ==========================================
// CELL CLICK
// ==========================================

cells.forEach(function(cell) {

    cell.addEventListener("click", function() {

        const index =
            Number(cell.dataset.index);


        // Don't allow occupied cell

        if (board[index] !== "") {
            return;
        }


        // Don't allow moves after game ends

        if (gameOver) {
            return;
        }


        // Don't allow human to move
        // when AI is thinking

        if (vsAI && currentPlayer === "O") {
            return;
        }


        makeMove(index, currentPlayer);


        // Check result

        const result = checkWinner();

        if (result) {
            finishGame(result);
            return;
        }


        // Switch player

        currentPlayer =
            currentPlayer === "X"
                ? "O"
                : "X";


        updateStatus();


        // AI move

        if (
            vsAI &&
            currentPlayer === "O" &&
            !gameOver
        ) {

            setTimeout(function() {

                makeAIMove();

            }, 400);

        }

    });

});


// ==========================================
// MAKE MOVE
// ==========================================

function makeMove(index, player) {

    board[index] = player;


    cells[index].textContent = player;


    cells[index].classList.add(
        player.toLowerCase()
    );

}


// ==========================================
// CHECK WINNER
// ==========================================

function checkWinner() {

    for (
        let i = 0;
        i < winningCombinations.length;
        i++
    ) {

        const combination =
            winningCombinations[i];


        const a = combination[0];

        const b = combination[1];

        const c = combination[2];


        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return {
                winner: board[a],

                combination: combination
            };

        }

    }


    // Check draw

    if (!board.includes("")) {

        return {
            winner: "draw",

            combination: []
        };

    }


    return null;
}


// ==========================================
// FINISH GAME
// ==========================================

function finishGame(result) {

    gameOver = true;


    if (result.winner === "draw") {

        resultText.textContent =
            "It's a Draw!";

        drawScore++;

        drawScoreElement.textContent =
            drawScore;


        statusText.textContent =
            "Game Over";

        return;
    }


    // Winner

    resultText.textContent =
        "Player " +
        result.winner +
        " Wins!";


    // Update score

    if (result.winner === "X") {

        xScore++;

        xScoreElement.textContent =
            xScore;

    }
    else {

        oScore++;

        oScoreElement.textContent =
            oScore;

    }


    statusText.textContent =
        "Winner: " +
        result.winner;


    // Highlight winning cells

    result.combination.forEach(function(index) {

        cells[index].classList.add(
            "winner"
        );

    });

}


// ==========================================
// UPDATE STATUS
// ==========================================

function updateStatus() {

    if (gameOver) {
        return;
    }


    if (vsAI && currentPlayer === "O") {

        statusText.textContent =
            "AI is thinking...";

    }
    else {

        statusText.textContent =
            "Player " +
            currentPlayer +
            "'s Turn";

    }

}


// ==========================================
// AI MOVE
// ==========================================

function makeAIMove() {

    if (gameOver) {
        return;
    }


    const availableMoves = [];


    // Find empty cells

    for (
        let i = 0;
        i < board.length;
        i++
    ) {

        if (board[i] === "") {

            availableMoves.push(i);

        }

    }


    // No moves

    if (availableMoves.length === 0) {
        return;
    }


    /*
        Simple AI:
        First try to win.
        Then try to block player.
        Otherwise choose a good position.
    */


    // Try winning move

    let move =
        findWinningMove("O");


    // Block X

    if (move === -1) {

        move =
            findWinningMove("X");

    }


    // Take center

    if (
        move === -1 &&
        board[4] === ""
    ) {

        move = 4;

    }


    // Take a corner

    if (move === -1) {

        const corners = [
            0,
            2,
            6,
            8
        ];


        const availableCorners =
            corners.filter(function(index) {

                return board[index] === "";

            });


        if (availableCorners.length > 0) {

            move =
                availableCorners[
                    Math.floor(
                        Math.random() *
                        availableCorners.length
                    )
                ];

        }

    }


    // Random move

    if (move === -1) {

        move =
            availableMoves[
                Math.floor(
                    Math.random() *
                    availableMoves.length
                )
            ];

    }


    // Make AI move

    makeMove(move, "O");


    // Check result

    const result =
        checkWinner();


    if (result) {

        finishGame(result);

        return;
    }


    // Switch back to X

    currentPlayer = "X";

    updateStatus();

}


// ==========================================
// FIND WINNING MOVE
// ==========================================

function findWinningMove(player) {

    for (
        let i = 0;
        i < board.length;
        i++
    ) {

        if (board[i] !== "") {
            continue;
        }


        // Temporarily place move

        board[i] = player;


        const result =
            checkWinner();


        // Undo move

        board[i] = "";


        if (
            result &&
            result.winner === player
        ) {

            return i;

        }

    }


    return -1;
}


// ==========================================
// RESET GAME
// ==========================================

function resetGame() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];


    currentPlayer = "X";

    gameOver = false;


    resultText.textContent = "";


    statusText.textContent =
        "Player X's Turn";


    cells.forEach(function(cell) {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "winner"
        );

    });

}


// ==========================================
// 2 PLAYER MODE
// ==========================================

playerModeBtn.addEventListener(
    "click",
    function() {

        vsAI = false;


        playerModeBtn.classList.add(
            "active"
        );

        aiModeBtn.classList.remove(
            "active"
        );


        resetGame();

    }
);


// ==========================================
// AI MODE
// ==========================================

aiModeBtn.addEventListener(
    "click",
    function() {

        vsAI = true;


        aiModeBtn.classList.add(
            "active"
        );

        playerModeBtn.classList.remove(
            "active"
        );


        resetGame();

    }
);


// ==========================================
// NEW GAME
// ==========================================

resetBtn.addEventListener(
    "click",
    resetGame
);
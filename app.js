/**
 *  IIFE for gameboard
 */

const gameboard = (function (){
    let board = ["","","","","","","","",""];

    // Should this be stored under gameboard?
    const winningCombinations = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    
    function getBoard(){
        return board;
    }

    function resetBoard(){
        board = ["","","","","","","","",""];
    }

    function placeMarker(index, marker){
        if(board[index]===""){
            board[index]=marker;
            return true;
        }
        else{
            return false;
        }
    }

    function logBoard(){
        console.log(`${board[0]} | ${board[1]} | ${board[2]} `)
        console.log(`${board[3]} | ${board[4]} | ${board[5]} `)
        console.log(`${board[6]} | ${board[7]} | ${board[8]} `)
    }

    function checkWinningMove(marker){
        for (let comb of winningCombinations) {
            let [a, b, c] = comb;
            if (board[a] === marker && board[b] === marker && board[c] === marker) {
                return true;
            }
        }
        return false;
    }
    

    function checkStall(){
        let freePos=0;
        board.forEach((position) =>{
            if(position===""){ freePos++}
        })

        return freePos;
    }

    return {
        getBoard, 
        resetBoard,
        placeMarker,
        checkWinningMove,
        checkStall,
        logBoard
    };
})();

/**
 * Factory for players
 */

let playerFactory=function(playerName,marker){
    let playerScore =0;
    const getPlayerScore=() => playerScore;
    const increaseScore=() => playerScore++;

    return{
        playerName,
        marker,
        increaseScore,
        getPlayerScore
    };
};

/**
 * IIFE For GameController
 */

const gameController= (function (
    playerOneName = "PlayerOne",
    playerOneMarker = "X",
    playerTwoName = "PlayerTwo",
    playerTwoMarker = "O"
){
    // Create players with the given data
    const players =[
        playerFactory(playerOneName,playerOneMarker),
        playerFactory(playerTwoName,playerTwoMarker)
    ];
    
    // Define first player
    let currentPlayer = 0;

    // Switch between players -- only 2 options so easy bool.
    function nextPlayer(){
        currentPlayer = currentPlayer ? 0 : 1 ; 
    }

    // Function to return current player
    function getCurrPlayer(){
        return players[currentPlayer];
    }

    function playRound(input){
        const playerMarker = getCurrPlayer().marker;

        // Place Marker
        const placed= gameboard.placeMarker(input,playerMarker);

        //Check Victory Condition
        let gameStatus = 0;
        if(!placed){
            gameStatus=-1;
        }
        else if(gameboard.checkWinningMove(playerMarker))
            { gameStatus= 1; }
        else if (gameboard.checkStall()==0){
            gameStatus =2;
        } 
        else {
            gameStatus=0;
            nextPlayer();
            gameboard.logBoard();
        }

        return gameStatus;
    }

    return {
        getCurrPlayer,
        playRound
    };

})();


console.log("Run gameController.playRound(index) to make a move");
gameboard.logBoard();

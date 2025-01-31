/**
 *  IIFE for gameboard
 */

const gameboard = (function (){
    let board = ["","","","","","","","",""];

    // Should this be stored under gameboard?
    const winningCombinations = [
        [1,2,3],[4,5,6],[7,8,9],
        [1,4,7],[2,5,8],[3,6,9],
        [1,5,9],[3,5,7]
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

    // Should this be stored under gameboard?
    function checkWinningMove(marker){
        winningCombinations.forEach((comb)=> {
            let [a,b,c]=comb;
            if(board[a]==marker && board[b]==marker && board[c]==marker){
                return true;
            }
            else{
                return false;
            }
        });
    }

    return {
        getBoard, 
        resetBoard,
        placeMarker,
        checkWinningMove
    };
})();

/**
 * IIFE For GameController
 */

const gameController= (function (){

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

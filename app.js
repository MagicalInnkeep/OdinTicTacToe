let game;

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
    let players =[
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
    // Function to reset the current player
    function resetPlayer(){
        currentPlayer=0;
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

    function setPlayers(newPlayerOneName, newPlayerOneMarker, newPlayerTwoName, newPlayerTwoMarker) {
        players = [
            playerFactory(newPlayerOneName || "PlayerOne", newPlayerOneMarker),
            playerFactory(newPlayerTwoName || "PlayerTwo", newPlayerTwoMarker)
        ];
        currentPlayer = 0; // Reset to first player
        gameboard.resetBoard(); // Reset the gameboard
        console.log(`Players updated: ${players[0].playerName} vs ${players[1].playerName}`);
    }

    function getPlayers(){
        return players;
    }

    return {
        getCurrPlayer,
        playRound,
        setPlayers,
        getPlayers,
        resetPlayer
    };

})();

//----------------------
// Game Play: Dom manipulations to play the game
//----------------------

const domGamePlay= function(){
    const container = document.querySelector(".container");

//Header section
    const header = document.createElement("div");
    header.setAttribute("class","header");

    //Banner section
    const banner = document.createElement("h1");
    banner.textContent="Tic-Tac-Toe";
    header.appendChild(banner);

    //Scoreboard section
    const scoreboard = document.createElement("div");
    scoreboard.setAttribute("id","scoreboard");
    const players = gameController.getPlayers();
    const player1Name = document.createElement("div");
    player1Name.textContent=`Player ${players[0].playerName}`;
    const player2Name = document.createElement("div");
    player2Name.textContent=`Player ${players[1].playerName}`;

    const vsText = document.createElement("div");
    vsText.setAttribute("id","vs");
    vsText.textContent="vs";

    const score1 = document.createElement("div");
    const scorevs = document.createElement("div");
    scorevs.setAttribute("id","vs");
    scorevs.textContent="-";
    const score2 = document.createElement("div");
    score1.textContent=`${players[0].getPlayerScore()}`;
    score2.textContent=`${players[1].getPlayerScore()}`;

    scoreboard.appendChild(player1Name);
    scoreboard.appendChild(vsText);
    scoreboard.appendChild(player2Name);

    const scoreboard2 = document.createElement("div");
    scoreboard2.setAttribute("id","scoreboard2");
    scoreboard2.appendChild(score1);
    scoreboard2.appendChild(scorevs);
    scoreboard2.appendChild(score2);

    header.appendChild(scoreboard);
    header.appendChild(scoreboard2);
    container.appendChild(header);

    //GameEnvironment section
    const gameEnv = document.createElement("div");
    gameEnv.setAttribute("class","gameEnv");
    for(let i=0;i<9;i++){
        const cell = document.createElement("div");
        cell.setAttribute("id",`cell${i}`);
        gameEnv.appendChild(cell);
    }
    let gameState =0;
    gameEnv.addEventListener('click', (event)=>{
        if(gameState==0){
            const marker = gameController.getCurrPlayer().marker;
            const player = gameController.getCurrPlayer().playerName;
            const clickedCell = gameController.playRound(event.target.id.slice(4));
            if(clickedCell==0){
                event.target.textContent=marker;
            }
            else if(clickedCell==1){
                event.target.textContent=marker;
                popUpDisplay(clickedCell,player);
                gameController.getCurrPlayer().increaseScore();
                score1.textContent=`${players[0].getPlayerScore()}`;
                score2.textContent=`${players[1].getPlayerScore()}`;
                gameState=1;
            }
            else if(clickedCell==2){
                event.target.textContent=marker;
                popUpDisplay(clickedCell,player);
                gameState=1;
            }
        }
    });

    container.appendChild(gameEnv);

    const refreshBtn = document.createElement("button");
    refreshBtn.textContent="Clean Slate";

    refreshBtn.addEventListener('click', (e)=>{
        gameboard.resetBoard();
        gameController.resetPlayer();
        for(let i=0;i<9;i++){
            const cell = document.querySelector(`#cell${i}`);
            cell.textContent="";
        }
        gameState=0;
    });

    container.appendChild(refreshBtn);

    // Game End Popup

    function popUpDisplay(state, name){
        const container = document.querySelector(".container");

        const popupDiv = document.createElement("div");
        popupDiv.setAttribute("class","popup");
        const popupContent = document.createElement("div");
        popupContent.setAttribute("class","popup-content");
        const popupText = document.createElement("p");
        popupText.textContent=state==1?`${name} won!`:`Draw!`;
        const popupBtn = document.createElement('button');
        popupBtn.textContent="OK";

        popupBtn.addEventListener('click', (event)=>{
            document.querySelector(".popup").remove();
        })

        popupContent.appendChild(popupText);
        popupContent.appendChild(popupBtn);
        popupDiv.appendChild(popupContent);
        container.appendChild(popupDiv);
    }
};


//-------------------
// Player Creation: This is the initial page to select your player name and marker
//-------------------

const domPlayerCreate=function(){
    const container = document.querySelector(".container");

    const playerCreate = document.createElement("form");
    playerCreate.setAttribute("class","playerCreateForm");

    const playerOneLabel = document.createElement("label");
    playerOneLabel.setAttribute("for","playerOne");
    playerOneLabel.textContent="Name Player 1: ";
    const playerTwoLabel = document.createElement("label");
    playerTwoLabel.setAttribute("for","playerTwo");
    playerTwoLabel.textContent="Name Player 2: ";
    const playerOneInput = document.createElement("input");
    playerOneInput.setAttribute("id","playerOne");
    playerOneInput.setAttribute("name","playerOne");
    const playerTwoInput = document.createElement("input");
    playerTwoInput.setAttribute("id","playerTwo");
    playerTwoInput.setAttribute("name","playerTwo");
    const btnCreatePlayer = document.createElement("button");
    btnCreatePlayer.textContent="Play";

    btnCreatePlayer.addEventListener('click', (event) =>{
        event.preventDefault();
        let player1Name = document.querySelector("#playerOne");
        let player2Name = document.querySelector("#playerTwo")
        gameController.setPlayers(player1Name.value, 'X', player2Name.value, 'O');
        container.removeChild(playerCreate);
        domGamePlay();
    });

    playerCreate.appendChild(playerOneLabel);
    playerCreate.appendChild(playerOneInput);
    playerCreate.appendChild(playerTwoLabel);
    playerCreate.appendChild(playerTwoInput);
    playerCreate.appendChild(btnCreatePlayer);

    container.appendChild(playerCreate);
}

domPlayerCreate();
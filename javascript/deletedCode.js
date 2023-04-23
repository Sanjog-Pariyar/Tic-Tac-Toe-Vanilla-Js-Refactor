const App = {
    $: {
        menu: document.querySelector('[data-id="menu"]'),
        menuItems: document.querySelector('[data-id="menu-items"]'),
        resetBtn: document.querySelector('[data-id="reset-btn"]'),
        newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
        squares: document.querySelectorAll('[data-id="square"]'),
        playerIcon: document.querySelector('[data-id="playerIcon"]'),
        playerText: document.querySelector('[data-id="playerText"]'),
        modal: document.querySelector('[data-id="modal"]'),
        modalText: document.querySelector('[data-id="modal-text"]'),
        modalBtn: document.querySelector('[data-id="modal-btn"]'),
    },

    state: {
        moves: [],
    },

    getGameStatus(moves) {

        const p1Moves = moves.filter(move => move.player === 1).map(move => move.squareId);
        const p2Moves = moves.filter(move => move.player === 2).map(move => move.squareId);

        const winningPattern = [
            [1, 2, 3],
            [1, 5, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 5, 7],
            [3, 6, 9],
            [4, 5, 6],
            [7, 8, 9],
        ];

        let winner = null;

        winningPattern.forEach((pattern) => {
            const p1Wins = pattern.every(v => p1Moves.includes(v));
            const p2Wins = pattern.every(v => p2Moves.includes(v));

            if (p1Wins) winner = 1;
            if (p2Wins) winner = 2;
        })

        return {
            status: moves.length === 9 || winner != null ? 'complete' : 'in-progress',
            winner
        }
    },

    init() {
        App.registerEventListeners()
    },

    registerEventListeners() {
        App.$.menu.addEventListener('click', event => {
            App.$.menuItems.classList.toggle('hidden');
        });

        App.$.resetBtn.addEventListener('click', event => {
            console.log('reset');
        });

        App.$.newRoundBtn.addEventListener('click', event => {
            console.log('New Round Started!')
        });

        App.$.modalBtn.addEventListener('click', event => {
            App.state.moves = [];
            App.$.squares.forEach((square) => square.replaceChildren())
            App.$.modal.classList.add('hidden')
        })

        App.$.squares.forEach((square) => {
            square.addEventListener('click', event => {

                // Checking to not respond while clicking the button twice
                const hasMove = (squareId) => {
                    const existingMove = App.state.moves.find(move => move.squareId === squareId)
                    return existingMove !== undefined;
                }

                if (hasMove(+square.id)) {
                    return
                };

                // Animation after each click on the square
                const animationIcon = App.$.playerIcon.classList
                animationIcon.add('animateIcon');
                setTimeout(() => {
                    animationIcon.remove('animateIcon')
                }, 1000);

                const animationText = App.$.playerText.classList
                animationText.add('animateText');
                setTimeout(() => {
                    animationText.remove('animateText')
                }, 1000);

                // determining the current state of the player according to whos turn it is
                const lastMove = App.state.moves.at(-1);
                const getOppositePlayer = (player) => (player === 1 ? 2 : 1);

                const currentPlayer = App.state.moves.length === 0 ? 1 : getOppositePlayer(lastMove.player);

                

                // Assigning classes according to current player
                if (currentPlayer === 1) {
                    const playerTurn = document.querySelector('.turn');

                    const circle = playerTurn.querySelector('.circle')
                    circle.textContent = 'O'

                    
                    playerTurn.classList.add("yellow");

                    const playerAlternateTurn = playerTurn.querySelector('.player-turn')
                    playerAlternateTurn.textContent = "Player two you're up"

                    const playerClick = event.target.classList
                    playerClick.add("blue")

                    const targetElement = event.target
                    const createEle = document.createElement('p');
                    createEle.textContent = 'X';

                    const gettingE = document.getElementById(targetElement.id);
                    gettingE.appendChild(createEle);

                } else {
                    const playerTurn = document.querySelector('.turn');
                    playerTurn.classList.replace("yellow", "blue");

                    const circle = playerTurn.querySelector('.circle');
                    circle.textContent = 'X';

                    const playerAlternateTurn = playerTurn.querySelector('.player-turn')
                    playerAlternateTurn.textContent = "Player one you're up"


                    const playerClick = event.target.classList
                    playerClick.add("yellow")

                    const targetElement = event.target
                    const createEle = document.createElement('p');
                    createEle.textContent = 'O';

                    const gettingE = document.getElementById(targetElement.id);
                    gettingE.appendChild(createEle);
                }

                // Updating State or mini-database for the game.
                App.state.moves.push({
                    squareId: +square.id,
                    player: currentPlayer,
                })

                // Check if there is a winner or tie game.
                const game = App.getGameStatus(App.state.moves);
                if (game.status === 'complete') {
                    App.$.modal.classList.remove('hidden');
                    if (game.winner) {
                        App.$.modalText.textContent = `'Player ${game.winner} wins!'`
                    } else {
                        App.$.modal.classList.remove('hidden');
                        App.$.modalText.textContent = 'The game is tied!'
                    }
                }
            })
            
        });
    },
}
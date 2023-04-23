export default class View {
    $ = {};
    $$ = {};

    #qs(selector, parent) {
        const el = parent ? parent.querySelector(selector) : document.querySelector(selector); 
        if (!el) throw new Error("Couldn't Find Element");
        return el;
    };

    #qsAll(selectors) {
        const eleList = document.querySelectorAll(selectors);
        if (!eleList) throw new Error("Couldn't Find Elements");
        return eleList;
    }

    constructor() {
        this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
        this.$.menuItems = this.#qs('[data-id="menu-items"]');
        this.$.resetBtn = this.#qs('[data-id="reset-btn"]');
        this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]');
        this.$.playerIcon = this.#qs('[data-id="playerIcon"]');
        this.$.playerText = this.#qs('[data-id="playerText"]');
        this.$.modal = this.#qs('[data-id="modal"]');
        this.$.modalText = this.#qs('[data-id="modal-text"]');
        this.$.modalBtn = this.#qs('[data-id="modal-btn"]');
        this.$.totalP1Win = this.#qs('[data-id="total-p1-wins"]');
        this.$.totalTies = this.#qs('[data-id="total-ties"]');
        this.$.totalP2Win = this.#qs('[data-id="total-p2-wins"]');
        this.$.grid = this.#qs('[data-id="grid"]');
        
        this.$$.squares = this.#qsAll('[data-id="square"]');


        // only UI section
        this.$.menuBtn.addEventListener('click', event => {
            this.#toggleMenu();
        });
    };


    render(game, stats){
        const { moves, currentPlayer, gameStatus, winner } = game;
        const { p1Wins, p2Wins, draws } = stats;

        this.#closeModalAndClearMoves();
        this.#initializeMoves(moves);
        this.#updateScoreboard(p1Wins, p2Wins, draws);
        this.#animation(currentPlayer);
        this.#gameCompleteModal(gameStatus, winner);
        
    };

    bindGameResetEvent(handler) {
        this.$.resetBtn.addEventListener('click', handler);
        this.$.modalBtn.addEventListener('click', handler);
    };

    bindNewRoundEvent(handler) {
        this.$.newRoundBtn.addEventListener('click', handler);
    };

    bindPlayerMoveEvent(handler) {
        this.#delegate(this.$.grid, '[data-id="square"]', 'click', handler)
    };

    #toggleMenu() {
        this.$.menuBtn.classList.toggle('border');
        this.$.menuItems.classList.toggle('hidden');

        const menuSideIcon = this.$.menuBtn.querySelector('span');

        switch (menuSideIcon.textContent) {
            case 'v':
                menuSideIcon.textContent = '^';
                break;
            case '^':
                menuSideIcon.textContent = 'v';
                break;
            default:
                null;
        };
    };

    #initializeMoves(moves) {
        this.$$.squares.forEach((square) => {
            const existingMove = moves.find(move => move.squareId === +square.id);

            if (existingMove) {
                this.#moveInClick(square, existingMove.player);
            };
        });

    };

    #animation(currentPlayer) {
        const icon = this.$.playerIcon;
        const label = this.$.playerText;

        // for icon
        icon.classList.add('animateIcon', currentPlayer.colorClass);
        icon.textContent = currentPlayer.icon;
        setTimeout(() => {
            icon.classList.remove('animateIcon');
        }, 1000);

        // for label
        label.classList.add('animateText', currentPlayer.colorClass);
        label.textContent = `${currentPlayer.name}, you're up.`;
        setTimeout(() => {
            label.classList.remove('animateText');
        }, 1000);
    };

    #moveInClick(square, currentPlayer) {
        const playerMove = document.getElementById(square.id);

        playerMove.textContent = currentPlayer.icon;
        playerMove.classList.add(currentPlayer.colorClass);
    };

    #gameCompleteModal(status, winner) {
        if (status === 'win') {
            this.$.modal.classList.remove('hidden');
            this.$.modalText.textContent = `Player ${winner} wins!`
        } else if (status === 'draw') {
            this.$.modal.classList.remove('hidden');
            this.$.modalText.textContent = 'Game is draw!';
        } else {
            null;
        };
    };

    #updateScoreboard(p1win, p2win, draw) {
        this.$.totalP1Win.textContent = `${p1win} Wins`;
        this.$.totalTies.textContent = draw;
        this.$.totalP2Win.textContent = `${p2win} Wins`;
    };

    #closeModalAndClearMoves() {
        this.$.playerIcon.classList.remove('yellow', 'blue')
        this.$.playerText.classList.remove('yellow', 'blue')
        this.$.menuItems.classList.add('hidden');
        this.$.menuBtn.classList.remove('border');
        this.$$.squares.forEach((square) => {
            square.textContent = '';
            square.classList.remove('blue', 'yellow');
        });
        this.$.modal.classList.add('hidden');
    };

    #delegate(el, selector, eventkey, handler) {
        el.addEventListener(eventkey, (event) => {
            if (event.target.matches(selector)) {
                handler(event.target);
            };
        });
    };
};
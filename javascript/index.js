import View from './views.js'
import Test from './test.js'
import Store from './store.js';


const players = [
    {
        id: 1,
        name: 'Player one',
        icon: 'X',
        colorClass: 'blue',
    },
    {
        id: 2,
        name: 'player two',
        icon: 'O',
        colorClass: 'yellow',
    },
];


function init() {
    const view = new View();
    const test = new Test();  // optional
    const store = new Store('live-t3-storage-key', players);

    
    store.addEventListener('statechange', () => {
        view.render(store.game, store.stats);
    })

    window.addEventListener('storage', () => {
        view.render(store.game, store.stats);
    })

    
    view.render(store.game, store.stats);


    view.bindGameResetEvent(event => {
        store.reset();
    });


    view.bindNewRoundEvent(event => {
        store.newRound();
    });


    view.bindPlayerMoveEvent(square => {

        const existingMove = store.game.moves.find(move => move.squareId === +square.id)

        if (existingMove) {
            return;
        }

        store.playerMove(square.id);
    });
};

window.addEventListener('load', init);
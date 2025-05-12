// src/game/MonopolyGame.cjs

module.exports = {
  MonopolyGame: {
    name: 'monopoly',

    setup: (ctx) => {
      const players = {};
      for (let i = 0; i < ctx.numPlayers; i++) {
        players[i] = {
          position: 0,
          balance: 1500,
        };
      }

      return {
        players,
        log: [],
      };
    },

    moves: {
      rollDice(G, ctx) {
        const player = G.players[ctx.currentPlayer];
        const dice = Math.floor(Math.random() * 6) + 1;
        player.position = (player.position + dice) % 40;
        player.balance -= 10; // демо-действие

        G.log.push(`Игрок ${ctx.currentPlayer} бросил кубик: ${dice}`);
      },
    },

    turn: {
      moveLimit: 1,
    },
  },
};

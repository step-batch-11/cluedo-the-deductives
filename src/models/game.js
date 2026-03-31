import { shuffle } from "@std/random";

export class Game {
  #states = { WAITING: "waiting", SETUP: "setup" };
  #currentState;
  #id;
  #board;
  #pawns;
  #pawnsToAssign;
  #deck;
  #players;
  #turnOrder;
  #shuffle;
  constructor(id, board, pawns, deck, shuffleFn = shuffle) {
    this.#currentState = this.#states.WAITING;
    this.#id = id;
    this.#board = board;
    this.#pawns = pawns;
    this.#deck = deck;
    this.#players = {};
    this.#shuffle = shuffleFn;
    this.#pawnsToAssign = shuffleFn(Object.values(pawns));
  }

  setTurnOrder() {
    this.#turnOrder = this.#shuffle(this.#players);
  }

  addPlayer(player) {
    const pawn = this.#pawnsToAssign.pop();
    player.assignPawn(pawn);
    this.#players[player.get().id] = player;
  }

  getAllPlayers() {
    return Object.values(this.#players).map((player) => player.get());
  }

  getPlayer(id) {
    return this.#players[id].get();
  }

  getAllPawns() {
    return Object.values(this.#pawns).map((pawn) => pawn.get());
  }

  getPawn(id) {
    return this.#pawns[id].get();
  }
}

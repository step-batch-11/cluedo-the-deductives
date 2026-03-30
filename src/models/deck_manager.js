import { shuffle } from "@std/random";

export class DeckManager {
  #shuffle;
  #suspects;
  #weapons;
  #rooms;
  #murderCombination;
  #remainingCards;

  constructor({ suspects, weapons, rooms }, shuffleFn = shuffle) {
    this.#shuffle = shuffleFn;
    this.#suspects = suspects;
    this.#weapons = weapons;
    this.#rooms = rooms;
    this.#segregateMurderCombination();
  }

  #segregateMurderCombination() {
    const [suspect, ...remainingSuspects] = this.#shuffle(this.#suspects);
    const [weapon, ...remainingWeapons] = this.#shuffle(this.#weapons);
    const [room, ...remainingRooms] = this.#shuffle(this.#rooms);

    this.#murderCombination = { weapon, suspect, room };
    this.#remainingCards = [
      ...remainingSuspects,
      ...remainingWeapons,
      ...remainingRooms,
    ];
  }

  getMurderCombination() {
    return { ...this.#murderCombination };
  }

  getRemainingCards() {
    return [...this.#remainingCards];
  }
}

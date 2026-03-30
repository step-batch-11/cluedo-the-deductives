import { isInRange } from "../utils/board_utils.js";

export class Board {
  #config;
  #tiles;
  #rooms;
  #doors;
  #adjecents;
  #secretPassages;
  #blockedSpace;
  #initialPositions;

  constructor(boardConfig) {
    this.#config = boardConfig;
    this.#tiles = {};
    this.#rooms = {};
    this.#adjecents = {};
    this.#doors = {};
    this.#secretPassages = {};
    this.#blockedSpace = {};
    this.#initialPositions = {};
  }

  #getRoomRanges() {
    return Object.values(this.#config.rooms).map((room) => room.areas);
  }

  #getBoundaryRanges() {
    return this.#config.walls;
  }

  #getStartingPositions() {
    return Object.values(this.#config.startingPositions);
  }

  #getAdjacent({ x, y }) {
    const adj = [];

    const left = { x: x - 1, y };
    const right = { x: x + 1, y };
    const top = { x, y: y - 1 };
    const bottom = { x, y: y + 1 };

    const invalidRanges = this.#getInvalidRanges();

    for (const position of [left, right, top, bottom]) {
      const isTile = this.#isTileArea(position, invalidRanges);

      if (isTile && position.x >= 0 && position.y >= 0) {
        const id = `tile-${position.x}-${position.y}`;
        adj.push(id);
      }
    }

    return adj;
  }

  #createTile(col, row) {
    const startingPositions = this.#getStartingPositions();
    const id = `tile-${row}-${col}`;

    this.#tiles[id] = {
      type: "tile",
      isOccupied: startingPositions.includes(id),
      adj: this.#getAdjacent({ x: col, y: row }),
    };
  }

  #isTileArea(position, ranges) {
    return !ranges.some(({ start, end }) => isInRange(position, start, end));
  }

  #getInvalidRanges() {
    const roomRanges = this.#getRoomRanges();
    const boundaryRanges = this.#getBoundaryRanges();

    return [...roomRanges, ...boundaryRanges].flat(Infinity);
  }

  #addAdjacents() {
    for (
      const [room, entrances] of Object.entries(
        this.#config.roomEntrances,
      )
    ) {
      entrances.forEach(({ x, y }) => {
        const tile = `tile-${x}-${y}`;

        if (this.#tiles[tile]) {
          this.#tiles[tile].adj.push(room);
        }
      });

      this.#rooms[room] = { adj: [...entrances] };
    }
  }

  #buildTiles(height, width) {
    const invalidRanges = this.#getInvalidRanges();
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const isTile = this.#isTileArea({ x: col, y: row }, invalidRanges);

        if (isTile) {
          this.#createTile(col, row);
        }
      }
    }
  }

  buildBoard() {
    this.#buildTiles(this.#config.size.height, this.#config.size.width);
    this.#addAdjacents();
  }

  getRooms() {
    return this.#rooms;
  }

  getTiles() {
    return this.#tiles;
  }
}

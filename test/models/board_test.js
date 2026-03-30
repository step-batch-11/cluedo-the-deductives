import { assert } from "@std/assert/assert";
import { assertEquals } from "@std/assert/equals";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { Board } from "../../src/models/board.js";

describe("BOARD - buildTiles", () => {
  let board;

  const mockConfig = {
    rooms: {
      room1: {
        areas: [[{ start: { x: 1, y: 1 }, end: { x: 2, y: 2 } }]],
      },
    },
    walls: [[{ start: { x: 0, y: 3 }, end: { x: 3, y: 3 } }]],
    startingPositions: {
      p1: "tile-0-0",
    },
  };

  beforeEach(() => {
    board = new Board(mockConfig);
  });

  describe("tile creation", () => {
    it(" => should create tiles only in valid areas", () => {
      board.buildTiles(4, 4);
      const tiles = board.getTiles();

      assert(tiles["tile-0-0"]);

      assertEquals(tiles["tile-1-1"], undefined);

      assertEquals(tiles["tile-3-0"], undefined);
    });
  });

  describe("adjacency", () => {
    it(" => should assign correct adjacent tiles", () => {
      board.buildTiles(3, 3);
      const tiles = board.getTiles();

      const tile = tiles["tile-0-0"];

      assertEquals(tile.adj.sort(), ["tile-0-1", "tile-1-0"].sort());
    });
  });

  describe("occupancy", () => {
    it(" => should mark starting positions as occupied", () => {
      board.buildTiles(3, 3);
      const tiles = board.getTiles();

      assertEquals(tiles["tile-0-0"].isOccupied, true);
    });

    it(" => should mark non-starting tiles as not occupied", () => {
      board.buildTiles(3, 3);
      const tiles = board.getTiles();

      assertEquals(tiles["tile-0-1"].isOccupied, false);
    });
  });

  describe("edge cases", () => {
    it(" => should handle empty board", () => {
      board.buildTiles(0, 0);
      const tiles = board.getTiles();

      assertEquals(Object.keys(tiles).length, 0);
    });

    it(" => should not create tiles outside bounds", () => {
      board.buildTiles(2, 2);
      const tiles = board.getTiles();

      assertEquals(tiles["tile-2-2"], undefined);
    });
  });
});

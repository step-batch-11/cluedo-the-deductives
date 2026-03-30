import { assert } from "@std/assert/assert";
import { assertEquals } from "@std/assert/equals";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { Board } from "../../src/models/board.js";

describe("BOARD - buildBoard", () => {
  let board;

  const baseConfig = {
    size: { height: 4, width: 4 },

    rooms: {
      room1: {
        areas: [[{ start: { x: 1, y: 1 }, end: { x: 2, y: 2 } }]],
      },
    },

    walls: [[{ start: { x: 0, y: 3 }, end: { x: 3, y: 3 } }]],

    startingPositions: {
      p1: "tile-0-0",
    },

    roomEntrances: {
      room1: [{ x: 0, y: 1 }],
    },
  };

  beforeEach(() => {
    board = new Board(baseConfig);
  });

  describe("tile creation", () => {
    it(" => should create tiles only in valid areas", () => {
      board.buildBoard();
      const tiles = board.getTiles();

      assert(tiles["tile-0-0"]);
      assertEquals(tiles["tile-1-1"], undefined);
      assertEquals(tiles["tile-3-0"], undefined);
    });
  });

  describe("adjacency", () => {
    it(" => should assign correct adjacent tiles", () => {
      board.buildBoard();
      const tiles = board.getTiles();

      const tile = tiles["tile-0-0"];

      assertEquals(
        tile.adj.filter((a) => a.startsWith("tile")).sort(),
        ["tile-0-1", "tile-1-0"].sort(),
      );
    });

    it(" => should not include negative coordinates in adjacency", () => {
      board.buildBoard();
      const tiles = board.getTiles();

      const tile = tiles["tile-0-0"];

      const hasNegative = tile.adj.some((id) => id.includes("--1"));

      assertEquals(hasNegative, false);
    });
  });

  describe("occupancy", () => {
    it(" => should mark starting positions as occupied", () => {
      board.buildBoard();
      const tiles = board.getTiles();

      assertEquals(tiles["tile-0-0"].isOccupied, true);
    });

    it(" => should mark non-starting tiles as not occupied", () => {
      board.buildBoard();
      const tiles = board.getTiles();

      assertEquals(tiles["tile-0-1"].isOccupied, false);
    });
  });

  describe("room entrances", () => {
    it(" => should connect entrance tile to room", () => {
      board.buildBoard();
      const tiles = board.getTiles();

      const entranceTile = tiles["tile-0-1"];

      assert(entranceTile.adj.includes("room1"));
    });

    it(" => should register room adjacency correctly", () => {
      board.buildBoard();
      const rooms = board.getRooms();

      assertEquals(rooms["room1"].adj, [{ x: 0, y: 1 }]);
    });

    it(" => should preserve existing tile adjacency when adding room links", () => {
      board.buildBoard();
      const tiles = board.getTiles();

      const entranceTile = tiles["tile-0-1"];

      assert(entranceTile.adj.includes("tile-0-0"));
      assert(entranceTile.adj.includes("room1"));
    });

    it(" => should not crash if entrance is inside invalid area", () => {
      const badConfig = {
        ...baseConfig,
        roomEntrances: {
          room1: [{ x: 1, y: 1 }],
        },
      };

      const badBoard = new Board(badConfig);

      badBoard.buildBoard();

      const rooms = badBoard.getRooms();
      assertEquals(rooms["room1"].adj, [{ x: 1, y: 1 }]);
    });
  });

  describe("edge cases", () => {
    it(" => should handle empty board", () => {
      const emptyBoard = new Board({
        ...baseConfig,
        size: { height: 0, width: 0 },
      });

      emptyBoard.buildBoard();
      const tiles = emptyBoard.getTiles();

      assertEquals(Object.keys(tiles).length, 0);
    });

    it(" => should not create tiles outside bounds", () => {
      const smallBoard = new Board({
        ...baseConfig,
        size: { height: 2, width: 2 },
      });

      smallBoard.buildBoard();
      const tiles = smallBoard.getTiles();

      assertEquals(tiles["tile-2-2"], undefined);
    });
  });
});

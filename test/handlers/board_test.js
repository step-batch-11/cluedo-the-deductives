import { describe, it } from "@std/testing/bdd";
import { createGameInstance } from "../../src/utils/game.js";
import { assertEquals } from "@std/assert/equals";
import {
  serveRollAndTurns,
  serveUpdatePawnPosition,
} from "../../src/handlers/board.js";
import { boardConfig } from "../../src/constants/board_config.js";
import { Board } from "../../src/models/board.js";

describe("HANDLER", () => {
  describe("dice value", () => {
    it(" => should get dice value", () => {
      const mockContext = {
        get() {
          const game = createGameInstance();

          game.start();
          return game;
        },
        json(value) {
          return JSON.stringify(value);
        },
      };

      const result = serveRollAndTurns(mockContext, () => 0.2);
      assertEquals(JSON.parse(result), {
        diceValue: 4,
        turns: ["tile-7-22", "tile-8-21", "tile-8-23", "tile-7-20"],
      });
    });
  });

  describe("update pawn position", () => {
    it(" => should update pawn position: from reachable nodes", async () => {
      const mockContext = {
        get() {
          const game = createGameInstance();
          game.start();
          return game;
        },
        json(value) {
          return JSON.stringify(value);
        },
        req: {
          json() {
            return {
              currentNodeId: "tile-7-24",
              turns: ["tile-7-24", "tile-0-2"],
            };
          },
        },
      };
      const result = await serveUpdatePawnPosition(mockContext);
      assertEquals(JSON.parse(result), { status: true });
    });
  });
  describe("catch error", () => {
    it(" => should catch error: from not reachable nodes", async () => {
      const mockContext = {
        get() {
          const game = createGameInstance();
          game.start();
          return game;
        },
        json(value) {
          return JSON.stringify(value);
        },
        req: {
          json() {
            return {
              currentNodeId: "tile-1-1",
              turns: ["tile-0-1", "tile-0-2"],
            };
          },
        },
      };
      const result = await serveUpdatePawnPosition(mockContext);
      assertEquals(JSON.parse(result), { status: false });
    });
  });
  it(" => should give all possible reachable positions: from a room(board config)", () => {
    const board = boardConfig;
    const smallBoard = new Board({
      ...board,
    });
    smallBoard.buildBoard();
    assertEquals(smallBoard.getReachableNodes("kitchen", 1), ["tile-4-6"]);
  });
});

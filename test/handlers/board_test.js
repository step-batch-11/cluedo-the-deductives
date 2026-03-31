import { describe, it } from "@std/testing/bdd";
import { createGameInstance } from "../../src/utils/game.js";
import { assertEquals } from "@std/assert/equals";
import {
  serveRollAndTurns,
  serveUpdatePawnPosition,
} from "../../src/handlers/board.js";

describe("HANDLER", () => {
  describe("dice value", () => {
    it(" => should get dice value", () => {
      const mockContext = {
        get() {
          return createGameInstance();
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
    it(" => should update pawn position", async () => {
      const mockContext = {
        get() {
          return createGameInstance();
        },
        json(value) {
          return JSON.stringify(value);
        },
        req: {
          json() {
            return { x: 7, y: 24 };
          },
        },
      };
      const result = await serveUpdatePawnPosition(mockContext);
      assertEquals(JSON.parse(result), { updatedPosition: { x: 7, y: 24 } });
    });
  });
});

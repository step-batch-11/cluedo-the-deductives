import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { getPosition, parseNode } from "../../src/utils/game.js";

describe("UTILS", () => {
  describe("UTILS: PARSE NODE TEST", () => {
    it(" => should return parsed node id for rooms", () => {
      assertEquals(parseNode("kitchen"), ["kitchen", {
        x: null,
        y: null,
        room: "kitchen",
      }]);
    });

    it(" => should return parsed node id for tiles", () => {
      assertEquals(parseNode("tile-6-7"), ["tile-6-7", {
        x: "6",
        y: "7",
        room: null,
      }]);
    });
  });

  describe("UTILS: GET POSTION TEST", () => {
    it(" => should return position for room", () => {
      assertEquals(
        getPosition({ position: { x: null, y: null, room: "kitchen" } }),
        "kitchen",
      );
    });

    it(" => should return position for tile", () => {
      assertEquals(
        getPosition({ position: { x: 1, y: 2, room: null } }),
        "tile-1-2",
      );
    });
  });
});

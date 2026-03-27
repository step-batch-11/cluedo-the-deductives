import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { main } from "../src/app.js";

describe("test", () => {
  it("app test", () => {
    assertEquals(main(), true);
  });
});

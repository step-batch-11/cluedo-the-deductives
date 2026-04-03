import { logger } from "hono/logger";
import { createApp } from "./src/app.js";
import { createGameInstance } from "./src/utils/game.js";

const main = () => {
  const PORT = Deno.env.get("PORT") || 8000;
  const game = createGameInstance();
  const app = createApp({
    game,
    getRandom: Math.random,
    roundUp: Math.ceil,
    logger,
  });
  Deno.serve({ port: PORT }, app.fetch);
};

main();

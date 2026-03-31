export const serveRollAndTurns = (c, randomFn = Math.random) => {
  const game = c.get("game");
  const diceValue = game.getRolledNumber(randomFn);
  const turns = getReachableTurns(game, diceValue);
  return c.json({ diceValue, turns });
};

const getReachableTurns = (game, steps) => {
  const pawnPosition = "tile-7-24";
  const board = game.getBoard();
  return board.getReachableNodes(pawnPosition, steps);
};

export const serveUpdatePawnPosition = async (c) => {
  const game = c.get("game");
  const currentNode = await c.req.json();
  const currentPawn = 2;
  const pawn = game.getPawnInstance(currentPawn);
  const updatedPosition = pawn.updatePosition(currentNode);
  return c.json({ updatedPosition });
};

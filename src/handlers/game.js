export const startGame = (c) => {
  const game = c.get("game");
  game.changeCurrentState();
  game.distributeCards();

  return c.redirect("/pages/setup.html", 303);
};

export const getGameState = (c) => {
  const game = c.get("game");
  const currentState = game.getCurrentState();
  return c.json(currentState, 200);
};

export const updateGameState = (c) => {
  const game = c.get("game");
  game.changeCurrentState();
  const currentState = game.getCurrentState();

  return c.json({ state: currentState.state }, 200);
};

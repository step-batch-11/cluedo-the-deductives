export const serveDiceValue = (c) => {
  const game = c.get("game");
  const diceValue = game.getRolledNumber();
  return c.json({ diceValue });
};

export const isInRange = ({ x, y }, start, end) => {
  const { x: x1, y: y1 } = start;
  const { x: x2, y: y2 } = end;

  return x >= x1 && x <= x2 && y >= y1 && y <= y2;
};

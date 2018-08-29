export const dummyNodeData = Array(10).fill(0).map((zero, index) => {
  return {id: index, position: [40 * index, 50 * index], size: 2 * index + 10};
});

export const dummyEdgeData = Array(5).fill(0).map((zero, index) => {
  return {id: index, source: [10 * index, 20 * index], target: [30 * index, 40 * index]};
});

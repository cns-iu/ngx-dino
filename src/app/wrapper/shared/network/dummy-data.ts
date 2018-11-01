const { floor, min, random } = Math;

const width = 500;
const height = 500;
const numNodes = 50;
const numEdges = numNodes - 1;
const nodeSizeRange = { min: 60, max: 100 };
const edgeStrokeWidthRange = { min: 1, max: 5 };
const nodeStrokeWidthRange = { min: 1, max: 5 };
const shapes = ['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'];


function randomIndex(length: number): number {
  return floor(length * random());
}

function createRandomNode(index: number) {
  return {
    id: index,
    position: [width * random(), height * random()],
    size: nodeSizeRange.min + (nodeSizeRange.max - nodeSizeRange.min) * random(),
    symbol: shapes[randomIndex(shapes.length)],
    nodeStroke: 'red',
    nodeStrokeWidth: nodeStrokeWidthRange.min + (nodeStrokeWidthRange.max - nodeStrokeWidthRange.min) * random(),
    nodeTooltip: 'Tool tip',
    nodeLabel: 'Node Label',
    nodeLabelPosition: 'Temp data',
    nodeTransparency: random(),
    strokeTransparency: random()
  };
}

export const dummyNodeData = Array(numNodes).fill(0).map((zero, index) => createRandomNode(index));

function createRandomEdge(index: number) {
  const length = min(index, numNodes);
  return {
    id: index,
    source: dummyNodeData[randomIndex(length)].position,
    target: dummyNodeData[randomIndex(length)].position,
    strokeWidth: edgeStrokeWidthRange.min + (edgeStrokeWidthRange.max - edgeStrokeWidthRange.min) * random(),
    transparency: random()
  };
}

export const dummyEdgeData = Array(numEdges).fill(0).map((zero, index) => createRandomEdge(index));

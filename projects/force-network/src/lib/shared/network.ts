export interface Node {
  id: string;
  [prop: string]: any;
}


export interface Link {
  id: string;
  source: Position;
  target: Position;
  [prop: string]: any;
}

export interface Graph {
  nodes: Node[];
  edges: Link[];
}

export interface Position {
  x: number;
  y: number;
}

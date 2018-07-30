export interface Node {
  id: string;
  [prop: string]: any;
}


export interface Link {
  id: string;
  source: string;
  target: string;
  [prop: string]: any;
}

export interface Graph {
  nodes: Node[];
  edges: Link[];
}

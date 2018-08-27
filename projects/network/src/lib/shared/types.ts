import { Datum } from '@ngx-dino/core';
import { Point } from './utility';

export class Node extends Datum {
  position: Point;
  size: number;
}

export class Edge extends Datum {
  source: Point;
  target: Point;
  stroke: string;
  strokeWidth: string;
}

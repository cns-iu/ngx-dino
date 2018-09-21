import { Datum } from '@ngx-dino/core';
import { Point } from './utility';

export class Node extends Datum {
  position: Point;
  size: number;
  symbol: string;
  color: number;

  // Calculated
  cposition: Point;
  csize: Point;
  ccolor: string;
}

export class Edge extends Datum {
  source: Point;
  target: Point;
  stroke: string;
  strokeWidth: number;

  // Calculated
  csource: Point;
  ctarget: Point;
}

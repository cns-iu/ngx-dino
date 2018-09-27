import { Datum } from '@ngx-dino/core';
import { Point } from './utility';

export class Node extends Datum {
  position: Point;
  size: number;
  symbol: string;
  color: string;
  stroke: string;
  strokeWidth: number;
  tooltip: string;
  label: string;
  labelPosition: string;

  // Calculated
  cposition: Point;
  csize: number;
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

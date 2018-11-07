import { Datum } from '@ngx-dino/core';
import { Point } from './utility';

export class Node extends Datum {
  position: Point;
  size: number;
  symbol: string;
  color: string;
  transparency: number;
  stroke: string;
  strokeWidth: number;
  strokeTransparency: number;
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
  transparency: number;
  stroke: string;
  strokeWidth: number;

  // Calculated
  csource: Point;
  ctarget: Point;
}

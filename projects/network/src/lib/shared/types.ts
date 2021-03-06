import { Datum } from '@ngx-dino/core';
import { Point } from './utility';

export class Node extends Datum {
  symbol: string;
  position: Point;
  size: number;
  color: string;
  transparency: number;
  stroke: string;
  strokeWidth: number;
  strokeTransparency: number;
  tooltip: string;
  label: string;
  labelPosition: string;
  pulse: boolean;

  // Calculated
  cposition: Point;
  csize: number;
  cxScale: number;
  cyScale: number;
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

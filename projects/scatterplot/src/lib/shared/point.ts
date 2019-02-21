import { Datum } from '@ngx-dino/core';

export class Point extends Datum<any> {
  id: string;
  x: number | string;
  y: number | string;
  color: string;
  shape: string;
  size: string;
  stroke: string;
  pulse: boolean;
  transparency: number;
  strokeTransparency: number;
}

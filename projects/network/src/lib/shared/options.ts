import { CanvasPath_D3Shape } from 'd3-shape';
import { Point, Range } from './utility';

// Coordinate space
export interface DynamicCoordinateSpace {
  type: 'dynamic';
}

export type OverflowPolicy = 'ignore' | 'clamp';
export interface FixedCoordinateSpace {
  type: 'fixed';
  x?: number | Range<number>;
  y?: number | Range<number>;
  xOverflow?: OverflowPolicy | Range<OverflowPolicy>;
  yOverflow?: OverflowPolicy | Range<OverflowPolicy>;
}

export type CoordinateSpace = DynamicCoordinateSpace | FixedCoordinateSpace;
export interface CoordinateSpaceOptions {
  x?: CoordinateSpace;
  y?: CoordinateSpace;
}


// Symbols
export type BuiltinSymbolTypes =
  'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';


// Curves
export type BuiltinLinkTypes = 'line';
export interface LinkType {
  draw(context: CanvasPathMethods, source: Point, target: Point): void;
}

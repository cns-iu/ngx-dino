import { Point, Range } from './utility';

// Coordinate space
export interface DynamicCoordinateSpace {
  type: 'dynamic';
}

export type OverflowPolicy = 'ignore' | 'clamp';
export interface FixedCoordinateSpace {
  type: 'fixed';
  x?: Range;
  y?: Range;
  xOverflow?: OverflowPolicy | [OverflowPolicy, OverflowPolicy];
  yOverflow?: OverflowPolicy | [OverflowPolicy, OverflowPolicy];
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
export type BuiltinEdgeTypes = 'line';
export interface EdgeType {
  draw(context: CanvasRenderingContext2D, source: Point, target: Point): void;
}

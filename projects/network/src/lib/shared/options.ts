export type Range<T> = [T, T] | {min: T, max: T};
export type OnOverflow = 'ignore' | 'clamp';

export interface DynamicCoordinateSpace {
  type: 'dynamic';
}

export interface FixedCoordinateSpace {
  type: 'fixed';
  x?: number | Range<number>;
  y?: number | Range<number>;
  xOverflow?: OnOverflow | Range<OnOverflow>;
  yOverflow?: OnOverflow | Range<OnOverflow>;
}

export type CoordinateSpace = DynamicCoordinateSpace | FixedCoordinateSpace;
export interface CoordinateSpaceOptions {
  x?: CoordinateSpace;
  y?: CoordinateSpace;
}

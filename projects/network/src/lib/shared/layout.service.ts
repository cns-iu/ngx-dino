import { Injectable } from '@angular/core';
import {
  assignWith,
  clamp,
  forEach,
  get,
  inRange,
  isFinite,
  isFunction,
  maxBy,
  partition,
  PropertyPath,
  sortBy,
  toPath,
} from 'lodash';

import { CoordinateSpace, CoordinateSpaceOptions, DynamicCoordinateSpace } from './options';
import { Edge, Node } from './types';
import { normalizeRange } from './utility';

export interface LayoutOptions {
  width: number;
  height: number;
  coordinateSpace?: CoordinateSpaceOptions;
  adjustMargins?: boolean;
}

export interface LayoutResult {
  nodes: Node[];
  edges: Edge[];

  excludedNodes: Node[];
  excludedEdges: Edge[];
}

interface NormalizedSpace {
  offset: number;
  range: number;
}

// Utility functions
function createPoint(): [number, number] {
  return [NaN, NaN];
}

function createExcludeFilter(
  space: CoordinateSpace, prop: 'x' | 'y', viewMax: number
): (value: number) => boolean {
  const overflowKey = (prop + 'Overflow') as 'xOverflow' | 'yOverflow';
  if (space.type === 'dynamic' || space[overflowKey] === 'clamp') {
    return isFinite;
  }

  const { min = 0, max = viewMax } = normalizeRange(space[prop]) || {};
  return value => inRange(value, min, max);
}

function createCoordinateNormalizer(
  [min, max]: [number, number], viewSpace: NormalizedSpace
): (coord: number) => number {
  const range = max - min;
  const factor = viewSpace.range / range;
  return coord => {
    const clamped = clamp(coord, min, max);
    const adjusted = clamped - min;
    return factor * adjusted + viewSpace.offset;
  };
}

function resetProperties<T>(array: T[], props: { [P in keyof T]?: T[P] | (() => T[P]) }): void {
  const customizer = (_objValue: any, value: any) => isFunction(value) ? value() : value;
  forEach(array, item => assignWith(item, props, customizer));
}

function normalizeViewSpace(
  nodes: Node[], width: number, height: number, adjustMargins: boolean
): [NormalizedSpace, NormalizedSpace] {
  if (adjustMargins) {
    const maxSize = get(maxBy(nodes, 'size'), 'size', 0);
    const maxRadius = Math.sqrt(maxSize) / 2;
    return [
      { offset: maxRadius, range: width - 2 * maxRadius },
      { offset: maxRadius, range: height - 2 * maxRadius }
    ];
  } else {
    return [
      { offset: 0, range: width },
      { offset: 0, range: height}
    ];
  }
}

function rangeOf(objects: any[], path: PropertyPath): [number, number] {
  const normPath = toPath(path);
  let min = Infinity;
  let max = -Infinity;
  for (const obj of objects) {
    const value: number = get(obj, normPath);
    if (value < min) {
      min = value;
    } else if (value > max) {
      max = value;
    }
  }

  return [min, max];
}

function spaceRange(
  nodes: Node[], edges: Edge[],
  space: CoordinateSpace, prop: 'x' | 'y', viewMax: number
): [number, number] {
  if (space.type === 'dynamic') {
    const pointIndex = prop === 'x' ? 0 : 1;
    const [nmin, nmax] = rangeOf(nodes, ['position', pointIndex]);
    if (edges.length === 0) {
      return [nmin, nmax];
    }

    const [esmin, esmax] = rangeOf(edges, ['source', pointIndex]);
    const [etmin, etmax] = rangeOf(edges, ['target', pointIndex]);
    return [Math.min(nmin, esmin, etmin), Math.max(nmax, esmax, etmax)];
  } else if (space[prop] === undefined) {
    return [0, viewMax];
  } else {
    const { min, max } = normalizeRange(space[prop]);
    return [min, max];
  }
}

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  constructor() { }

  layout(nodes: Node[], edges: Edge[], options: LayoutOptions): LayoutResult {
    if (nodes.length === 0 && edges.length === 0) {
      return { nodes, edges, excludedNodes: [], excludedEdges: [] };
    }

    // Reset computed properties
    resetProperties(nodes, { cposition: createPoint, csize: 0, cxScale: 1, cyScale: 1 });
    resetProperties(edges, { csource: createPoint, ctarget: createPoint });

    // Destructure and normalize arguments
    const dynamicSpace: DynamicCoordinateSpace = { type: 'dynamic' };
    const {
      width, height, adjustMargins = true,
      coordinateSpace: { x: xSpace = dynamicSpace, y: ySpace = dynamicSpace } = {}
    } = options;

    // Filter nodes and edges
    const xFilter = createExcludeFilter(xSpace, 'x', width);
    const yFilter = createExcludeFilter(ySpace, 'y', height);

    const [includedNodes, excludedNodes] = partition(nodes, node => {
      const [x, y] = node.position;
      return xFilter(x) && yFilter(y);
    });

    const [includedEdges, excludedEdges] = partition(edges, edge => {
      const { source: [sx, sy], target: [tx, ty] } = edge;
      return xFilter(sx) && yFilter(sy) && xFilter(tx) && yFilter(ty);
    });

    // Calculate space ranges
    const [xViewSpace, yViewSpace] = normalizeViewSpace(nodes, width, height, adjustMargins);
    const xRange = spaceRange(includedNodes, includedEdges, xSpace, 'x', width);
    const yRange = spaceRange(includedNodes, includedEdges, ySpace, 'y', height);
    const xScale = xViewSpace.range / (xRange[1] - xRange[0]);
    const yScale = yViewSpace.range / (yRange[1] - yRange[0]);

    // Normalize and set coordinates
    const xNorm = createCoordinateNormalizer(xRange, xViewSpace);
    const yNorm = createCoordinateNormalizer(yRange, yViewSpace);

    includedNodes.forEach(node => {
      const [x, y] = node.position;
      node.cposition = [xNorm(x), yNorm(y)];
      node.cxScale = xScale;
      node.cyScale = yScale;
    });

    includedEdges.forEach(edge => {
      const { source: [sx, sy], target: [tx, ty] } = edge;
      edge.csource = [xNorm(sx), yNorm(sy)];
      edge.ctarget = [xNorm(tx), yNorm(ty)];
    });

    return {
      nodes: sortBy(includedNodes, node => !!node.labelPosition),
      edges: includedEdges,
      excludedNodes, excludedEdges
    };
  }
}

import { BarItem } from './types';

export function extractStyles(item: BarItem): object {
  return {
    'fill': item.color,
    'fill-opacity': 1 - item.transparency,
    'stroke': item.strokeColor,
    'stroke-width': item.strokeWidth,
    'stroke-opacity': 1 - item.strokeTransparency
  };
}

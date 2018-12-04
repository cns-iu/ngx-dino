import { SymbolType } from 'd3-shape';

import { Field, constant as constantOp, simpleField } from '@ngx-dino/core';

export type NumberWithDims = number & {
  width: number;
  height: number;
};

export function NumberWithDims(value: number, width: number, height: number): NumberWithDims {
  const result = new Number(value) as NumberWithDims; // tslint:disable-line:no-construct
  result.width = width;
  result.height = height;
  return result;
}


export const barSymbol: SymbolType = {
  draw(context: CanvasPath, size: NumberWithDims): void {
    const { width = 0, height = 0 } = size;
    if (width && height) {
      context.rect(-width / 2, -height / 2, width, height);
    }
  }
};

export const barSymbolField: Field<SymbolType> = simpleField<SymbolType>({
  label: 'Bar Symbol',
  operator: constantOp(barSymbol)
});

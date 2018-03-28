/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />

import { Operator } from '../operators';
import { Field, BoundField } from './field';
import '../operators/add/static/access';
import '../operators/add/method/map';


describe('fields', () => { // Prevent deep indentation

// Fields are immutable so its fine to declare it once and share it
const simpleField = new Field({
  id: '1',
  label: 'A simple test field',

  initialOp: Operator.access('a'),
  mapping: [
    ['size', Operator.map((value) => 2 * value)],
    ['ident', true]
  ]
});

describe('Field', () => {
  it('should set properties', () => {
    expect(simpleField.id).toBeDefined();
    expect(simpleField.label).toBeDefined();
    expect(simpleField.datatype).toBeDefined();
    expect(simpleField.initialOp).toBeDefined();
    expect(simpleField.mapping).toBeDefined();
  });

  it('should return BoundField for valid selectors', () => {
    expect(simpleField.getBoundField('size')).toEqual(jasmine.any(BoundField));
  });

  it('should return Operator for valid selectors', () => {
    expect(simpleField.getOperator('size')).toEqual(jasmine.any(Operator));
  });

  it('should return initialOp for mappings with value `true`', () => {
    expect(simpleField.getOperator('ident')).toBe(simpleField.initialOp);
  });

  it('should return undefined for invalid selectors', () => {
    expect(simpleField.getBoundField('bad')).toBeUndefined();
    expect(simpleField.getOperator('bad')).toBeUndefined();
  });
});

describe('BoundField', () => {
  const bound = simpleField.getBoundField('size');

  it('should set properties', () => {
    expect(bound.field).toBe(simpleField);
    expect(bound.operator).toEqual(jasmine.any(Operator));
  });

  it('shoud get a value using operator', () => {
    spyOn(bound.operator, 'get').and.callThrough();

    bound.get({a: 1});
    expect(bound.operator.get).toHaveBeenCalled();
  });
});
});

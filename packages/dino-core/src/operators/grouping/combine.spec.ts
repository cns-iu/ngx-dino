/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />

import { CombineOperator } from './combine';
import { ConstantOperator } from '../generating/constant';


describe('operators', () => { // Prevent deep indentation
describe('grouping', () => { // Prevent deep indentation
describe('CombineOperator', () => {
  it('should set a schema', () => {
    const op = new CombineOperator({foo: 'bar'});

    expect(op.schema).toBeDefined();
  });

  it('should replace operators with their values (flat)', () => {
    const cop = new ConstantOperator(0);
    const schema = [1, cop];
    const op = new CombineOperator(schema);

    expect(op.get(undefined)).toEqual([1, 0]);
  });

  it('should replace operators with their values (nested)', () => {
    const cop = new ConstantOperator(0);
    const schema = {a: {b: [1, cop]}};
    const op = new CombineOperator(schema);

    expect(op.get(undefined)).toEqual({a: {b: [1, 0]}});
  });

  it('should replace operators with their values (circular)', () => {
    const cop = new ConstantOperator(0);
    const schema = {a: {b: [1, cop]}};
    schema['self'] = schema;

    const op = new CombineOperator(schema);

    expect(op.get(undefined)).toEqual(jasmine.objectContaining(
      {a: {b: [1, 0]}}
    ));
  });

  it('should be equal if equivalent schemas', () => {
    const cop = new ConstantOperator(0);
    const schema1 = {a: {b: [1, cop]}};
    const schema2 = {a: {b: [1, cop]}};

    const op1 = new CombineOperator(schema1);
    const op2 = new CombineOperator(schema1);
    const op3 = new CombineOperator(schema2);

    expect(op1.equals(op2)).toBeTruthy();
    expect(op1.equals(op3)).toBeTruthy();
  });

  it('should not be equal if different schemas', () => {
    const cop = new ConstantOperator(0);
    const schema1 = {a: {b: [1, cop]}};
    const schema2 = {a: {b: [1, cop, 1]}};

    const op1 = new CombineOperator(schema1);
    const op2 = new CombineOperator(schema2);

    expect(op1.equals(op2)).toBeFalsy();
  });
});
});
});

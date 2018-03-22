/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />

import { ChainOperator } from './chain';
import { ConstantOperator } from '../generating/constant';


describe('operators', () => { // Prevent deep indentation
describe('grouping', () => { // Prevent deep indentation
describe('ChainOperator', () => {
  it('should set operators', () => {
    const op = new ChainOperator();

    expect(op.operators).toBeDefined();
  });

  it('should remove undefined operators', () => {
    const op = new ChainOperator(undefined, undefined);

    expect(op.operators.size).toBe(0);
  });

  it('should pass the value through each operator', () => {
    const cop1 = new ConstantOperator(0);
    const cop2 = new ConstantOperator(1);
    const op = new ChainOperator(cop1, cop2);

    spyOn(cop1, 'get');
    spyOn(cop2, 'get');

    op.get(undefined);
    expect(cop1.get).toHaveBeenCalled();
    expect(cop2.get).toHaveBeenCalled();
  });

  it('should be equal if the same operators', () => {
    const cop1 = new ConstantOperator(0);
    const cop2 = new ConstantOperator(1);

    const op1 = new ChainOperator(cop1, cop2);
    const op2 = new ChainOperator(cop1, cop2);

    expect(op1.equals(op2)).toBeTruthy();
  });

  it('should not be equal if different operators', () => {
    const cop1 = new ConstantOperator(0);
    const cop2 = new ConstantOperator(1);

    const op1 = new ChainOperator(cop1);
    const op2 = new ChainOperator(cop2);

    expect(op1.equals(op2)).toBeFalsy();
  });

  it('should not be equal if same operators different order', () => {
    const cop1 = new ConstantOperator(0);
    const cop2 = new ConstantOperator(1);

    const op1 = new ChainOperator(cop1, cop2);
    const op2 = new ChainOperator(cop2, cop1);

    expect(op1.equals(op2)).toBeFalsy();
  });
});
});
});

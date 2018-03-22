/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />

import { ChainOperator } from './chain';


function createOperatorSpy(getFunc?: (value: any) => any): any {
  const spy = jasmine.createSpyObj('Operator', ['get', 'unwrap']);

  spy['unwrap'].and.returnValue(spy);
  if (getFunc) {
    spy['get'].and.callFake(getFunc);
  }

  return spy;
}

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
    const spy1 = createOperatorSpy();
    const spy2 = createOperatorSpy();
    const op = new ChainOperator(spy1, spy2);

    op.get(undefined);
    expect(spy1['get'].calls.any()).toBeTruthy();
    expect(spy2['get'].calls.any()).toBeTruthy();
  });

  it('should be equal if the same operators', () => {
    const spy1 = createOperatorSpy();
    const spy2 = createOperatorSpy();

    const op1 = new ChainOperator(spy1, spy2);
    const op2 = new ChainOperator(spy1, spy2);

    expect(op1.equals(op2)).toBeTruthy();
  });

  it('should not be equal if different operators', () => {
    const spy1 = createOperatorSpy();
    const spy2 = createOperatorSpy();

    const op1 = new ChainOperator(spy1);
    const op2 = new ChainOperator(spy2);

    expect(op1.equals(op2)).toBeFalsy();
  });

  it('should not be equal if same operators different order', () => {
    const spy1 = createOperatorSpy();
    const spy2 = createOperatorSpy();

    const op1 = new ChainOperator(spy1, spy2);
    const op2 = new ChainOperator(spy2, spy1);

    expect(op1.equals(op2)).toBeFalsy();
  });
});
});
});

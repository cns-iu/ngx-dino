import { List } from 'immutable';

import {
  Flags, BaseCache, Operator, MockOperator, create
} from '../../test-util';
import { ChainOperator } from './chain';


describe('operators', () => {
describe('classes', () => {
describe('grouping', () => {
describe('ChainOperator', () => {
  let spy1: jasmine.Spy;
  let spy2: jasmine.Spy;
  let ops: Operator<any, any>[];
  let op: Operator<any, any>;
  let rawOp: ChainOperator<any, any>;

  beforeEach(() => {
    spy1 = jasmine.createSpy();
    spy2 = jasmine.createSpy();
    ops = [create(MockOperator, spy1, 'm1'), create(MockOperator, spy2, 'm2')];
    op = create(ChainOperator, ...ops);
    rawOp = op.wrapped as ChainOperator<any, any>;
  });

  it('should create', () => {
    expect(op.wrapped).toEqual(jasmine.any(ChainOperator));
  });

  it('should have operators', () => {
    expect(rawOp.operators).toEqual(jasmine.any(List));
  });

  it('should ignore undefined', () => {
    const ops2 = [undefined, create(MockOperator), undefined];
    const op2 = create(ChainOperator, ...ops2);
    const rawOp2 = op2.wrapped as ChainOperator<any, any>;
    const allDefined = rawOp2.operators.every((o) => o !== undefined);

    expect(allDefined).toBeTruthy();
  });

  it('should behave like an identity operator if no operators', () => {
    const op2 = create(ChainOperator);
    expect(op2.get(111)).toBe(111);
  });

  it('should pass result of one operator to the next', () => {
    spy1.and.returnValue(22);

    op.get(1);
    expect(spy1).toHaveBeenCalledWith(1, jasmine.any(BaseCache));
    expect(spy2).toHaveBeenCalledWith(22, jasmine.any(BaseCache));
  });

  it('should return the value of the last operator', () => {
    spy2.and.returnValue('aab');
    expect(op.get('bvcx')).toBe('aab');
  });

  // TODO: More intensive/complex tests

  it('should be equal if same operators', () => {
    const op2 = create(ChainOperator, ...ops);
    expect(op.equals(op2)).toBeTruthy();
  });

  it('should not be equal if different', () => {
    const op2 = create(ChainOperator, create(MockOperator));
    expect(op.equals(op2)).toBeFalsy();
  });

  it('should not be equal if same operators in different order', () => {
    const op2 = create(ChainOperator, ...ops.slice().reverse());
    expect(op.equals(op2)).toBeFalsy();
  });
});
});
});
});

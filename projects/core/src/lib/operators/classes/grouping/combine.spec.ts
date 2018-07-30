import { List } from 'immutable';

import {
  Flags, BaseCache, Operator, MockOperator, create
} from '../../test-util';
import { CombineOperator } from './combine';


describe('operators', () => {
describe('classes', () => {
describe('grouping', () => {
describe('CombineOperator', () => {
  let spy1: jasmine.Spy;
  let spy2: jasmine.Spy;
  let schema: any;
  let op: Operator<any, any>;
  let rawOp: CombineOperator<any, any>;

  beforeEach(() => {
    spy1 = jasmine.createSpy();
    spy2 = jasmine.createSpy();
    schema = {
      a: create(MockOperator, spy1, 'm1'),
      b: create(MockOperator, spy2, 'm2')
    };
    op = create(CombineOperator, schema);
    rawOp = op.wrapped as CombineOperator<any, any>;
  });

  it('should create', () => {
    expect(op.wrapped).toEqual(jasmine.any(CombineOperator));
  });

  it('should have a schema', () => {
    expect(rawOp.schema).toBeDefined();
  });

  it('should replace operators with their results', () => {
    spy1.and.returnValue(1);
    spy2.and.returnValue(2);

    expect(op.get('some data')).toEqual({a: 1, b: 2});
  });

  it('should remove values for which the operator returns undefined', () => {
    spy1.and.returnValue(undefined);
    spy2.and.returnValue('defined');

    expect(op.get(56789)).toEqual({b: 'defined'});
  });

  // TODO: More intensive/complex tests

  it('should compare equal for equivalent schemas', () => {
    const schema2 = {
      a: create(MockOperator, undefined, 'm1'),
      b: create(MockOperator, undefined, 'm2')
    };
    const op2 = create(CombineOperator, schema2);

    expect(op.equals(op2)).toBeTruthy();
  });

  it('should not be equal for different schemas', () => {
    const schema2 = [1, create(MockOperator, undefined, 'm3')];
    const op2 = create(CombineOperator, schema2);

    expect(op.equals(op2)).toBeFalsy();
  });
});
});
});
});

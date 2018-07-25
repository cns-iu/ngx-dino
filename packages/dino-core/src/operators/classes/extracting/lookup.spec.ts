import { Map } from 'immutable';

import { Operator, create } from '../../test-util';
import { LookupOperator } from './lookup';


describe('operators', () => {
describe('classes', () => {
describe('extracting', () => {
describe('LookupOperator', () => {
  const mapping = Map({a: 1, b: 2});
  const defaultValue = 33;
  let op: Operator<any, any>;
  let rawOp: LookupOperator<any, any>;

  beforeEach(() => {
    op = create(LookupOperator, mapping, defaultValue);
    rawOp = op.wrapped as LookupOperator<any, any>;
  });

  it('should create', () => {
    expect(op.wrapped).toEqual(jasmine.any(LookupOperator));
  });

  it('should have a mapping', () => {
    expect(rawOp.mapping).toEqual(mapping);
  });

  it('should have a default value', () => {
    expect(rawOp.defaultValue).toEqual(defaultValue);
  });

  it('should look up a value', () => {
    expect(op.get('a')).toEqual(1);
  });

  it('should return the default value if look up fails', () => {
    expect(op.get('bad-key')).toBe(defaultValue);
  });

  it('should be equal if equal mappings and default values', () => {
    const op2 = create(LookupOperator, mapping, defaultValue);
    expect(op.equals(op2)).toBeTruthy();
  });

  it('should not be equal if different mappings', () => {
    const op2 = create(LookupOperator, {c: 'd'}, defaultValue);
    expect(op.equals(op2)).toBeFalsy();
  });

  it('should not be equal if different default values', () => {
    const op2 = create(LookupOperator, mapping, 123);
    expect(op.equals(op2)).toBeFalsy();
  });
});
});
});
});

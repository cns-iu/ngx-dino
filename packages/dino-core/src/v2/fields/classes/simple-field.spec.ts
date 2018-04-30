import { constant } from '../../operators/methods/generating/constant';
import { identity } from '../../operators/methods/extracting/identity';
import { BoundField } from '../base/bound-field';
import { SimpleField } from './simple-field';


describe('fields', () => {
describe('classes', () => {
describe('SimpleField', () => {
  const label = 'test';
  const defaultId = 'default';
  const operator = identity();
  let field: SimpleField<any>;

  beforeEach(() => {
    field = new SimpleField({label, defaultId, operator});
  });

  it('should create', () => {
    expect(field).toEqual(jasmine.any(SimpleField));
  });

  it('should have a defaultId', () => {
    expect(field.defaultId).toBe(defaultId);
  });

  it('should have an operator', () => {
    expect(field.operator).toBe(operator);
  });

  it('should return a sequence of strings with the defaultId from Field#getBoundFieldIds', () => {
    expect(field.getBoundFieldIds().toArray()).toEqual([defaultId]);
  });

  it('should return a BoundField from Field#getBoundField', () => {
    expect(field.getBoundField()).toEqual(jasmine.any(BoundField));
  });

  it('should return the default BoundField when called without an id from Field#getBoundField', () => {
    const bfield1 = field.getBoundField();
    const bfield2 = field.getBoundField(defaultId);
    expect(bfield1).toBe(bfield2);
  });

  it('should equal if the same defaultId and operator', () => {
    const field2 = new SimpleField({label, defaultId, operator});
    expect(field.equals(field2)).toBeTruthy();
  });

  it('should not equal if different defaultIds', () => {
    const field2 = new SimpleField({label, defaultId: 'other', operator});
    expect(field.equals(field2)).toBeFalsy();
  });

  it('should not be equal if different operators', () => {
    const field2 = new SimpleField({label, defaultId, operator: constant(0)});
    expect(field.equals(field2)).toBeFalsy();
  });
});
});
});

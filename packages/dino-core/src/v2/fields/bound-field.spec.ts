import immutableEqualityTester from '../test-utility/equality/immutable';

import { Operator } from '../operators';
import { constant } from '../operators/methods/generating/constant';

import { DataType, BaseFieldArgs, Field } from './field';
import { BoundField } from './bound-field';


function makeBoundField<T>(
  id: string, operator: Operator<any, T>, args?: Partial<BaseFieldArgs>
): {field: Field<T>, bound: BoundField<T>} {
  const fieldArgs = Object.assign({label: '', mapping: {[id]: operator}}, args);
  const field = new Field(fieldArgs);
  const bound = field.getBoundField(id);

  return {field, bound};
}


describe('fields', () => {
describe('BoundField', () => {
  const id = 'a-bound-field';
  const label = 'test';
  const dataType = DataType.String;
  const op = constant('qwerty');
  const {field, bound} = makeBoundField(id, op, {label, dataType});


  beforeEach(() => {
    // Add equality testers
    jasmine.addCustomEqualityTester(immutableEqualityTester);
  });


  describe('.id', () => {
    it('is the same as the mapping key', () => {
      expect(bound.id).toBe(id);
    });
  });


  describe('.field', () => {
    it('is the containing field', () => {
      expect(bound.field.mapping.toArray()).toContain(bound);
    });
  });


  describe('.operator', () => {
    it('is an Operator', () => {
      expect(bound.operator).toEqual(jasmine.any(Operator));
    });
  });


  describe('.label', () => {
    it('is the same as the field\'s label', () => {
      expect(bound.label).toBe(label);
    });
  });


  describe('.dataType', () => {
    it('is the same as the field\'s dataType', () => {
      expect(bound.dataType).toBe(dataType);
    });
  });


  describe('.get(data, cache)', () => {
    const data = 1234;
    const cache: any = {};
    const resultData = 'zxc';
    let spy: jasmine.Spy;
    let result: any;


    beforeEach(() => {
      spy = spyOn(bound.operator, 'get').and.returnValue(resultData);
      result = bound.get(data, cache);
    });


    it('forward calls to Operator#get', () => {
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('forward arguments to Operator#get', () => {
      expect(spy).toHaveBeenCalledWith(data, cache);
    });

    it('returns the result from Operator#get', () => {
      expect(result).toBe(resultData);
    });
  });


  describe('.getter', () => {
    it('returns Operator#getter', () => {
      expect(bound.getter).toBe(bound.operator.getter);
    });
  });


  describe('.equals(other)', () => {
    const {field: fieldEquiv, bound: boundEquiv} = makeBoundField(id, op, {
      label, dataType
    });

    it('equals a BoundField from an equivalent Field', () => {
      expect(bound).toEqual(boundEquiv);
    });
  });
});
});

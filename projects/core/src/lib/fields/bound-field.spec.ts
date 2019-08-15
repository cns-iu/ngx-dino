import { Operator } from '../operator';
import { constant } from '../operators';
import { BoundField } from './bound-field';
import { BaseFieldArgs, DataType, Field } from './field';


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


  describe('.id', () => {
    it('is the same as the mapping key', () => {
      expect(bound.id).toBe(id);
    });
  });


  describe('.field', () => {
    it('is the containing field', () => {
      expect(bound.field).toEqual(field);
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
    const resultData = 'zxc';


    beforeEach(() => {
      this.spy = spyOn(bound, 'operator').and.returnValue(resultData);
      this.result = bound.get(data);
    });


    it('forward calls to Operator#get', () => {
      expect(this.spy).toHaveBeenCalledTimes(1);
    });

    it('forward arguments to Operator#get', () => {
      expect(this.spy).toHaveBeenCalledWith(data);
    });

    it('returns the result from Operator#get', () => {
      expect(this.result).toBe(resultData);
    });
  });


  describe('.getter', () => {
    it('returns Operator#getter', () => {
      expect(bound.getter).toBe(bound.operator);
    });
  });
});
});

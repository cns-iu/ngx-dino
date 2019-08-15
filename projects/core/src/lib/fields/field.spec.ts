import { constant } from '../operators';
import { BoundField } from './bound-field';
import { DataType, Field } from './field';


describe('fields', () => {
describe('Field', () => {
  const emptyField = new Field({label: '', mapping: {}});

  const id = 'myid';
  const label = 'test';
  const dataType = DataType.Number;
  const bfid = 'foo';
  const op = constant(123);
  const defaultOp = constant(456);
  const mapping = {
    [bfid]: op,
    [Field.defaultSymbol]: defaultOp
  };
  const fullField = new Field({id, label, dataType, mapping});


  describe('#defaultSymbol', () => {
    it('is defined on the class/constructor', () => {
      expect(Field.defaultSymbol).toBeDefined();
    });
  });


  describe('.id', () => {
    it('is set to the provided value', () => {
      expect(fullField.id).toBe(id);
    });

    it('is created if not provided', () => {
      expect(emptyField.id).toBeDefined();
    });
  });


  describe('.label', () => {
    it('is set to the provided value', () => {
      expect(fullField.label).toBe(label);
    });
  });


  describe('.dataType', () => {
    it('is set to the provided value', () => {
      expect(fullField.dataType).toBe(dataType);
    });

    it('is set to \'DataType.Any\' if not provided', () => {
      expect(emptyField.dataType).toBe(DataType.Any);
    });
  });


  describe('.mapping', () => {
    // TODO
  });


  describe('.getBoundFieldIds()', () => {
    beforeEach(() => {
      this.bfids = fullField.getBoundFieldIds();
    });

    it('returns a sequence of BoundField ids', () => {
      expect(this.bfids).toContain(bfid);
    });

    it('does not contain \'Field.defaultSymbol\'', () => {
      expect(this.bfids).not.toContain(Field.defaultSymbol);
    });
  });


  describe('.getBoundField(id)', () => {
    it('returns a BoundField for a valid id', () => {
      expect(fullField.getBoundField(bfid)).toEqual(jasmine.any(BoundField));
    });

    it('returns undefined for an invalid id', () => {
      expect(fullField.getBoundField('bad')).toBeUndefined();
    });

    it('returns the default when called without an id', () => {
      expect(fullField.getBoundField()).toEqual(jasmine.any(BoundField));
    });
  });
});
});

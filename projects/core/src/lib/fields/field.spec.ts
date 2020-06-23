import { Map } from 'immutable';

import immutableEqualityTester from '../test-utility/equality/immutable';
import oneOfMatchers from '../test-utility/matchers/one-of';

import { constant } from '../operators/methods/generating/constant';

import { DataType, Field } from './field';
import { BoundField } from './bound-field';

(function () {
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


  beforeEach(() => {
    // Add equality testers
    jasmine.addCustomEqualityTester(immutableEqualityTester);

    // Add matchers
    jasmine.addMatchers(oneOfMatchers);
  });


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
    it('is a Immutable.Map', () => {
      expect(emptyField.mapping).toEqual(jasmine.any(Map));
    });

    it('has the keys provided', () => {
      const keys = fullField.mapping.keySeq().toArray();
      expect(keys).toEqual(jasmine.arrayContaining([
        bfid, Field.defaultSymbol
      ]));
    });

    it('has BoundField values', () => {
      fullField.mapping.forEach((value) => {
        expect(value).toEqual(jasmine.any(BoundField));
      });
    });

    it('has BoundField values containing the provided operators', () => {
      const ops = [op, defaultOp];
      fullField.mapping.forEach((value) => {
        expect(value.operator).toBeOneOf(ops);
      });
    });
  });


  describe('.getBoundFieldIds()', () => {
    beforeEach(() => {
      this.bfids = fullField.getBoundFieldIds().toArray();
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


  describe('.equals(other)', () => {
    const fieldEquiv = new Field({id, label, dataType, mapping});
    const fieldDiffId = new Field({id: 'another', label, dataType, mapping});
    const fieldDiffLabel = new Field({id, label: 'abc', dataType, mapping});


    it('is true if equal dataType and mapping', () => {
      expect(fullField).toEqual(fieldEquiv);
    });

    it('is compared regardless of id', () => {
      expect(fullField).toEqual(fieldDiffId);
    });

    it('is compared regardless of label', () => {
      expect(fullField).toEqual(fieldDiffLabel);
    });
  });
});
});
}).call({});

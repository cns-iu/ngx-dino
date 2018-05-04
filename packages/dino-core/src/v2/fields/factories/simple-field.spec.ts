import immutableEqualityTester from '../../test-utility/equality/immutable';
import oneOfMatchers from '../../test-utility/matchers/one-of';

import { constant } from '../../operators/methods/generating/constant';

import { DataType, Field } from '../field';
import { BoundField } from '../bound-field';
import { simpleField } from './simple-field';


describe('fields', () => {
describe('factories', () => {
describe('simpleField', () => {
  const id = 'myid';
  const label = 'test';
  const dataType = DataType.Number;
  const bfid = 'foo';
  const operator = constant(123);
  const field = simpleField({id, label, dataType, bfieldId: bfid, operator});


  beforeEach(() => {
    // Add equality testers
    jasmine.addCustomEqualityTester(immutableEqualityTester);
  });


  it('returns a Field', () => {
    expect(field).toEqual(jasmine.any(Field));
  });


  describe('.getBoundField()', () => {
    const bfield = field.getBoundField();


    it('returns a BoundField', () => {
      expect(bfield).toBeDefined();
    });

    it('returns a BoundField with the specified operator', () => {
      expect(bfield.operator).toBe(operator);
    });
  });


  describe('.getBoundField(id)', () => {
    const noBfidField = simpleField({id, label, dataType, operator});
    const noBfidIdBfield = noBfidField.getBoundField(bfid);
    const defaultBfield = field.getBoundField();
    const bfield = field.getBoundField(bfid);

    it('returns undefined if no bfieldId was specified in the simpleField arguments', () => {
      expect(noBfidIdBfield).toBeUndefined();
    });

    it('returns the same BoundField as the default', () => {
      expect(bfield).toEqual(defaultBfield);
    });
  });
});
});
});

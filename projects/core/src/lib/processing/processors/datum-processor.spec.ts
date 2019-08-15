import { Map } from 'immutable';

import { simpleField } from '../../fields';
import { constant } from '../../operators/constant';
import immutableEqualityTester from '../../test-utility/equality/immutable';
import { Datum } from '../datums';
import { DatumProcessor } from './datum-processor';


describe('processing', () => {
describe('processors', () => {
describe('DatumProcessor', () => {
  beforeEach(() => {
    // Add equality testers
    jasmine.addCustomEqualityTester(immutableEqualityTester);


    this.bfield1 = simpleField({
      label: 'test0',
      operator: constant(0)
    }).getBoundField();
    this.bfield2 = simpleField({
      label: 'test1',
      operator: constant(1)
    }).getBoundField();
    this.datum = new Datum(0, 'abc');
    this.processor = new DatumProcessor(
      Map([['a', this.bfield1]]),
      Map([['b', this.bfield2]])
    );
  });


  describe('.process(datum)', () => {
    beforeEach(() => {
      this.spy1 = spyOn(this.bfield1, 'get').and.callThrough();
      this.spy2 = spyOn(this.bfield2, 'get').and.callThrough();

      this.result = this.processor.process(this.datum);
    });


    it('returns the processed datum', () => {
      expect(this.result).toEqual(jasmine.objectContaining({a: 0, b: 1}));
    });

    it('calls the extract fields with the raw data', () => {
      expect(this.spy1).toHaveBeenCalledWith('abc');
    });

    it('calls the compute fields with the datum', () => {
      expect(this.spy2).toHaveBeenCalledWith(this.datum);
    });
  });
});
});
});

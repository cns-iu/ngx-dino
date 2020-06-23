import { List, Map } from 'immutable';
import { of, Subject } from 'rxjs';
import { mergeAll } from 'rxjs/operators';

import { simpleField } from '../../fields';
import { constant } from '../../operators/methods/generating/constant';
import immutableEqualityTester from '../../test-utility/equality/immutable';
import oneOfMatchers from '../../test-utility/matchers/one-of';
import { CachedChangeStream, ChangeSet } from '../changes';
import { Datum } from '../datums';
import { DataProcessor } from './data-processor';

(function() {
describe('processing', () => {
describe('processors', () => {
describe('DataProcessor', () => {
  beforeEach(() => {
    // Add equality testers
    jasmine.addCustomEqualityTester(immutableEqualityTester);

    // Add matchers
    jasmine.addMatchers(oneOfMatchers);


    this.change1 = new ChangeSet(List.of(new Datum(0)));
    this.change2 = new ChangeSet(List.of(new Datum(1)));
    this.dataStream = of(this.change1, this.change2);
    this.emitStream = new Subject();
    this.stream = of(this.dataStream, this.emitStream).pipe(mergeAll());
    this.rawCached = new CachedChangeStream(this.stream);
    this.bfield1 = simpleField({
      label: 'test0',
      operator: constant(0)
    }).getBoundField();
    this.bfield2 = simpleField({
      label: 'test1',
      operator: constant(1)
    }).getBoundField();
    this.bfield3 = simpleField({
      label: 'test2',
      operator: constant(2)
    }).getBoundField();
    this.bfield4 = simpleField({
      label: 'test3',
      operator: constant(3)
    }).getBoundField();
    this.processor = new DataProcessor(
      this.rawCached,
      Map([['a', this.bfield1]]),
      Map([['b', this.bfield2]])
    );
    this.outStream = this.processor.asObservable();

    this.partialResult = jasmine.objectContaining({a: 0, b: 1});
  });


  describe('.updateFields(extracted, computed)', () => {
    it('emits the reprocessed values', () => {
      expect(true).toBeTruthy(); // FIXME
    });
  });


  describe('.asObservable()', () => {
    it('emits the processed values', (done) => {
      this.outStream.subscribe({
        next: (value) => {
          expect(value.insert.toArray()).toContain(this.partialResult);
        },
        complete: done
      });
      this.emitStream.complete();
    });
  });
});
});
});
}).call({});

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/last';

import { List, Map } from 'immutable';

import immutableEqualityTester from '../../test-utility/equality/immutable';
import oneOfMatchers from '../../test-utility/matchers/one-of';

import { constant } from '../../operators/methods/generating/constant';
import { simpleField } from '../../fields';
import { BoundField } from '../../fields';
import { Datum } from '../datums';
import { ChangeSet, CachedChangeStream } from '../changes';
import { DataProcessor } from './data-processor';


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
    this.dataStream = Observable.of(this.change1, this.change2);
    this.emitStream = new Subject();
    this.stream = Observable.merge(this.dataStream, this.emitStream);
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
    it('emits the reprocessed values', (done) => {
      // FIXME
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

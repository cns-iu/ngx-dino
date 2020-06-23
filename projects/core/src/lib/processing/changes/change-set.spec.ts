import { List } from 'immutable';

import immutableEqualityTester from '../../test-utility/equality/immutable';

import { access } from '../../operators/methods/extracting/access';
import { simpleField } from '../../fields';
import { Datum } from '../datums';
import { RawChangeSet } from './raw-change-set';
import { ChangeSet } from './change-set';

(function () {
describe('processing', () => {
describe('changes', () => {
describe('ChangeSet', () => {
  beforeEach(() => {
    // Add equality testers
    jasmine.addCustomEqualityTester(immutableEqualityTester);


    const insert = this.insert = List.of(new Datum('abc', {foo: 1}));
    const remove = this.remove = List.of(new Datum('def'));
    const update = this.update = List.of(new Datum('ghi', {foo: 22}));
    const replace = this.replace = List.of(new Datum('jkl', {foo: 33}));
    this.set = new ChangeSet(insert, remove, update, replace);
  });


  describe('.insert', () => {
    it('is set to the specified value', () => {
      expect(this.set.insert).toEqual(this.insert);
    });
  });


  describe('.remove', () => {
    it('is set to the specified value', () => {
      expect(this.set.remove).toEqual(this.remove);
    });
  });


  describe('.update', () => {
    it('is set to the specified value', () => {
      expect(this.set.update).toEqual(this.update);
    });
  });


  describe('.replace', () => {
    it('is set to the specified value', () => {
      expect(this.set.replace).toEqual(this.replace);
    });
  });


  describe('#fromRawChangeSet', () => {
    beforeEach(() => {
      const field = this.field = simpleField({
        label: 'test',
        operator: access('id')
      });
      const bfield = this.bfield = field.getBoundField();

      const insert = this.rinsert = [{id: 0, data: 'a'}];
      const remove = this.rremove = [1];
      const update: any = this.rupdate = [[2, {data: 'b'}]];
      const replace: any = this.rreplace = [[3, {id: 3, data: 'c'}]];
      const set = this.rset = new RawChangeSet(insert, remove, update, replace);

      this.set2 = ChangeSet.fromRawChangeSet(bfield, set);
      this.curriedFun = () => {
        return ChangeSet.fromRawChangeSet(this.bfield)(this.rset);
      };
    });


    it('can be curried', () => {
      expect(this.curriedFun).not.toThrow();
    });

    it('returns a ChangeSet', () => {
      expect(this.set2).toEqual(jasmine.any(ChangeSet));
    });

    // TODO test member values
  });
});
});
});
}).call({});

import { RawChangeSet } from './raw-change-set';

(function () {
describe('processing', () => {
describe('changes', () => {
describe('RawChangeSet', () => {
  beforeEach(() => {
    const insert = this.insert = [{id: 0, foo: 'a'}, {id: 1, foo: 'b'}];
    const remove = this.remove = [2, 3];
    const update: any = this.update = [[4, {foo: 'q'}], [5, {foo: 'w'}]];
    const replace: any = this.replace = [[6, {id: 6, foo: 'r'}], [7, {id: 7, foo: 't'}]];
    this.set = new RawChangeSet<any>(insert, remove, update, replace);
  });


  describe('.insert', () => {
    it('is set to the specified value', () => {
      expect(this.set.insert).toBe(this.insert);
    });
  });


  describe('.remove', () => {
    it('is set to the specified value', () => {
      expect(this.set.remove).toBe(this.remove);
    });
  });


  describe('.update', () => {
    it('is set to the specified value', () => {
      expect(this.set.update).toBe(this.update);
    });
  });


  describe('.replace', () => {
    it('is set to the specified value', () => {
      expect(this.set.replace).toBe(this.replace);
    });
  });


  describe('#fromArray', () => {
    beforeEach(() => {
      this.set2 = RawChangeSet.fromArray(this.insert);
    });


    it('return a RawChangeSet', () => {
      expect(this.set2).toEqual(jasmine.any(RawChangeSet));
    });

    it('sets .insert to the specified value', () => {
      expect(this.set2.insert).toBe(this.insert);
    });

    it('sets .remove to an empty array', () => {
      expect(this.set2.remove).toEqual([]);
    });

    it('sets .update to an empty array', () => {
      expect(this.set2.update).toEqual([]);
    });

    it('sets .replace to an empty array', () => {
      expect(this.set2.replace).toEqual([]);
    });
  });
});
});
});
}).call({});

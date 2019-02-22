import { Operator } from '../operator/operator';
import { ItemTransformer } from './item-transformer';
import { OperatorEntry } from './types';


describe('Processing', () => {
  describe('ItemTransformer', () => {
    const key1 = 'abc';
    const key2 = '11';
    const key3 = 'foo';
    const spy1Result = 1;
    const spy2Result = 'rfv';
    const operator3 = new Operator();
    let spy1: jasmine.Spy;
    let spy2: jasmine.Spy;
    let transformer: ItemTransformer<any, any>;

    beforeEach(() => {
      spy1 = jasmine.createSpy().and.returnValue(spy1Result);
      spy2 = jasmine.createSpy().and.returnValue(spy2Result);

      transformer = new ItemTransformer(
        [key1, new Operator(spy1)],
        [key2, new Operator(spy2)]
      );
    });

    describe('ItemTransformer(entry1, entry2, ...)', () => {
      const entries: OperatorEntry[] = [
        jasmine.arrayWithExactContents([key1, jasmine.any(Operator)]),
        jasmine.arrayWithExactContents([key2, jasmine.any(Operator)])
      ] as any;

      it('creates an ItemTransformer', () => {
        expect(transformer).toEqual(jasmine.any(ItemTransformer));
      });

      it('set the operator entries', () => {
        expect(transformer.entries).toEqual(jasmine.arrayWithExactContents(entries));
      });
    });

    describe('ItemTransformer.prototype', () => {
      describe('.add(entry1, entry2, ...)', () => {
        const entry3: OperatorEntry = [key3, operator3];
        const duplicateEntry: OperatorEntry = [key2, operator3];
        let transformer1: ItemTransformer;
        let transformer2: ItemTransformer;

        beforeEach(() => {
          transformer1 = transformer.add(entry3);
          transformer2 = transformer.add(duplicateEntry);
        });

        it('adds new entries to the end', () => {
          expect(transformer1.entries).toContain(entry3);
        });

        it('ignore duplicate entries', () => {
          expect(transformer2.entries).not.toContain(duplicateEntry);
        });
      });

      describe('.replace(entry1, entry2, ...)', () => {
        const replaceEntry: OperatorEntry = [key2, operator3];
        const unknownEntry: OperatorEntry = [key3, operator3];
        let transformer1: ItemTransformer;
        let transformer2: ItemTransformer;

        beforeEach(() => {
          transformer1 = transformer.replace(replaceEntry);
          transformer2 = transformer.replace(unknownEntry);
        });

        it('replaces entries', () => {
          expect(transformer1.entries.length).toEqual(transformer.entries.length);
          expect(transformer1.entries).toContain(replaceEntry);
        });

        it('ignores non-existing entries', () => {
          expect(transformer2.entries).toEqual(jasmine.arrayWithExactContents(transformer.entries));
        });
      });

      describe('.remove(key1, key2, ...)', () => {
        const removedEntry: OperatorEntry = [key1, jasmine.anything()] as any;
        let transformer1: ItemTransformer;
        let transformer2: ItemTransformer;

        beforeEach(() => {
          transformer1 = transformer.remove(key1);
          transformer2 = transformer.remove(key3);
        });

        it('removes the entries with the specified keys', () => {
          expect(transformer1.entries).not.toContain(removedEntry);
        });

        it('ignores unknown keys', () => {
          expect(transformer2.entries).toEqual(jasmine.arrayWithExactContents(transformer.entries));
        });
      });

      describe('.retain(key1, key2, ...)', () => {
        const retainedEntry: OperatorEntry = [key1, jasmine.anything()] as any;
        let transformer1: ItemTransformer;
        let transformer2: ItemTransformer;

        beforeEach(() => {
          transformer1 = transformer.retain(key1);
          transformer2 = transformer.retain(key3);
        });

        it('only has entries with the specified keys', () => {
          expect(transformer1.entries).toEqual(jasmine.arrayWithExactContents([retainedEntry]));
        });

        it('ignores unknown keys', () => {
          expect(transformer2.entries.length).toEqual(0);
        });
      });

      describe('.transform(item)', () => {
        const item = { hello: 'test' };
        let transformResult: any;

        beforeEach(() => {
          transformResult = transformer.transform(item);
        });

        it('calls each operator with the item', () => {
          expect(spy1).toHaveBeenCalledWith(item);
          expect(spy2).toHaveBeenCalledWith(item);
        });

        it('sets each property to the result of its Operator call', () => {
          expect(transformResult).toEqual(jasmine.objectContaining({ [key1]: spy1Result }));
          expect(transformResult).toEqual(jasmine.objectContaining({ [key2]: spy2Result }));
        });
      });

      describe('.(item)', () => {
        const item = { hello: 'test' };
        let transformResult: any;
        let callResult: any;

        beforeEach(() => {
          transformResult = transformer.transform(item);
          callResult = transformer(item);
        });

        it('produces the same result as .transform(item)', () => {
          expect(callResult).toEqual(transformResult);
        });
      });
    });
  });
});

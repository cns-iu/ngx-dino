import { ChangeEvent, InsertEvent, RemoveEvent, UpdateEvent } from './change';

function testIsEventOfType(event: any, type: string): void {
  expect(event).toEqual(jasmine.any(Object));
  expect(event.type).toEqual(type);
  expect(event.values).toEqual(jasmine.any(Array));
}

function testEventValues(event: ChangeEvent<any>, values: any[]): void {
  expect(event.values).toEqual(jasmine.arrayWithExactContents(values));
}

function testUpdateEventKeys(event: UpdateEvent<any>, keys: any[]): void {
  expect(event.keys).toEqual(jasmine.arrayWithExactContents(keys));
}

describe('Processing', () => {
  describe('InsertEvent', () => {
    const v1 = [1];
    const v2 = [2];
    const varray = [v1, v2];

    describe('.of(v1, v2, ...)', () => {
      const event = InsertEvent.of(v1, v2);

      it('returns an InsertEvent', () => {
        testIsEventOfType(event, 'insert');
      });

      it('contains an array of the values', () => {
        testEventValues(event, varray);
      });
    });

    describe('.from(values)', () => {
      const event = InsertEvent.from(varray);

      it('returns an InsertEvent', () => {
        testIsEventOfType(event, 'insert');
      });

      it('contains an array of the values', () => {
        testEventValues(event, varray);
      });
    });
  });

  describe('RemoveEvent', () => {
    const v1 = [1];
    const v2 = [2];
    const varray = [v1, v2];

    describe('.of(v1, v2, ...)', () => {
      const event = RemoveEvent.of(v1, v2);

      it('returns a RemoveEvent', () => {
        testIsEventOfType(event, 'remove');
      });

      it('contains an array of the values', () => {
        testEventValues(event, varray);
      });
    });

    describe('.from(values)', () => {
      const event = RemoveEvent.from(varray);

      it('returns a RemoveEvent', () => {
        testIsEventOfType(event, 'remove');
      });

      it('contains an array of the values', () => {
        testEventValues(event, varray);
      });
    });
  });

  describe('UpdateEvent', () => {
    const keys = ['a', 'b', 'c'];
    const v1 = [1];
    const v2 = [2];
    const varray = [v1, v2];

    describe('.of(keys, v1, v2, ...)', () => {
      const event = UpdateEvent.of(keys, v1, v2);

      it('returns an UpdateEvent', () => {
        testIsEventOfType(event, 'update');
      });

      it('contains an array of the keys', () => {
        testUpdateEventKeys(event, keys);
      });

      it('contains an array of the values', () => {
        testEventValues(event, varray);
      });
    });

    describe('.from(keys, values)', () => {
      const event = UpdateEvent.from(keys, varray);

      it('returns an UpdateEvent', () => {
        testIsEventOfType(event, 'update');
      });

      it('contains an array of the keys', () => {
        testUpdateEventKeys(event, keys);
      });

      it('contains an array of the values', () => {
        testEventValues(event, varray);
      });
    });
  });
});

import { isDatumId } from './datum-id';
import { Datum, isDatum, idSymbol, rawDataSymbol } from './datum';

(function () {
describe('processing', () => {
describe('datums', () => {
  const id = 'abc123';
  const data = 'payload';

  beforeEach(() => {
    this.datum = new Datum(id, data);
  });


describe('Datum', () => {
  describe('[idSymbol]', () => {
    beforeEach(() => {
      this.id = this.datum[idSymbol];
    });


    it('is set to the specified value', () => {
      expect(this.id).toBe(id);
    });

    it('is a DatumId', () => {
      expect(isDatumId(this.id)).toBeTruthy();
    });
  });


  describe('[rawDataSymbol]', () => {
    beforeEach(() => {
      this.data = this.datum[rawDataSymbol];
    });


    it('is set to the specified value', () => {
      expect(this.data).toBe(data);
    });
  });
});

describe('isDatum', () => {
  it('is true for Datum instances', () => {
    expect(isDatum(this.datum)).toBeTruthy();
  });

  it('is true for objects with [idSymbol]', () => {
    expect(isDatum({[idSymbol]: 123})).toBeTruthy();
  });

  it('is false for numbers', () => {
    expect(isDatum(1)).toBeFalsy();
  });

  it('is false for strings', () => {
    expect(isDatum('gfd')).toBeFalsy();
  });

  it('is false for arrays', () => {
    expect(isDatum([])).toBeFalsy();
  });

  it('is false for objects', () => {
    expect(isDatum({})).toBeFalsy();
  });
});
});
});
}).call({});

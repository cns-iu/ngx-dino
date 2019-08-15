import { simpleField } from '../../fields';
import { access } from '../../operators';
import { DatumId, extractId, isDatumId } from './datum-id';


describe('processing', () => {
describe('datums', () => {
describe('isDatumId', () => {
  it('is true for numbers', () => {
    expect(isDatumId(123)).toBeTruthy();
  });

  it('is true for strings', () => {
    expect(isDatumId('bar')).toBeTruthy();
  });

  it('is false for booleans', () => {
    expect(isDatumId(true)).toBeFalsy();
    expect(isDatumId(false)).toBeFalsy();
  });

  it('is false for arrays', () => {
    expect(isDatumId([])).toBeFalsy();
  });

  it('is false for objects', () => {
    expect(isDatumId({})).toBeFalsy();
  });
});

describe('extractId', () => {
  const field = simpleField<DatumId>({
    label: 'test',
    operator: access('id')
  });
  const bfield = field.getBoundField();


  beforeEach(() => {
    this.spy = spyOn(bfield, 'get').and.callThrough();
    this.result = extractId({id: 'foobar'}, bfield);
  });


  it('returns unmodified if the argument is a DatumId', () => {
    expect(extractId(456, bfield)).toBe(456);
  });

  it('uses the field to extract if the argument in not a DatumId', () => {
    expect(this.spy).toHaveBeenCalledTimes(1);
  });

  it('returns the extracted DatumId', () => {
    expect(this.result).toBe('foobar');
  });
});
});
});

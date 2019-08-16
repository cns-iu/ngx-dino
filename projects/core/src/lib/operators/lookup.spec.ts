import { isOperator } from '../operator';
import { lookup } from './lookup';

describe('operators', () => {
const mapping = { a: 1 };

describe('lookup(mapping)', () => {
  it('creates an Operator', () => {
    expect(isOperator(lookup(mapping))).toBeTruthy();
  });

  it('returns the corresponding mapping value on calls', () => {
    const op = lookup(mapping);
    expect(op('a')).toEqual(mapping.a);
  });

  it('returns undefined if the key does not exist', () => {
    const op = lookup(mapping);
    expect(op('bad' as any)).toBeUndefined();
  });
});

describe('lookup(mapping, defaultValue)', () => {
  it('creates an Operator', () => {
    expect(isOperator(lookup(mapping, 'def'))).toBeTruthy();
  });

  it('returns the corresponding mapping value on calls', () => {
    const op = lookup(mapping, 'def');
    expect(op('a')).toEqual(mapping.a);
  });

  it('returns the default value if the key does not exist', () => {
    const op = lookup(mapping, 'def');
    expect(op('bad' as any)).toEqual('def');
  });
});
});

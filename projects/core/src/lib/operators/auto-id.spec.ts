import { isOperator } from '../operator';
import { autoId } from './auto-id';

describe('operators', () => {
describe('autoId()', () => {
  it('creates an Operator', () => {
    expect(isOperator(autoId())).toBeTruthy();
  });

  it('generates different values on each call', () => {
    const op = autoId();
    const v1 = op(1);
    const v2 = op(1);
    expect(v1).not.toEqual(v2);
  });
});

describe('autoId(prefix)', () => {
  it('creates an Operator', () => {
    expect(isOperator(autoId('foo'))).toBeTruthy();
  });

  it('generates different values on each call', () => {
    const op = autoId('foo');
    const v1 = op(1);
    const v2 = op(1);
    expect(v1).not.toEqual(v2);
  });

  it('the generated value contains the prefix', () => {
    const op = autoId('foo');
    expect(op(1)).toMatch(/foo.*/);
  });
});

describe('autoId(prefix, start)', () => {
  it('creates an Operator', () => {
    expect(isOperator(autoId('foo', 2))).toBeTruthy();
  });

  it('generates different values on each call', () => {
    const op = autoId('foo', 2);
    const v1 = op(1);
    const v2 = op(1);
    expect(v1).not.toEqual(v2);
  });

  it('starts generating identifiers with index `start`', () => {
    const op = autoId('foo', 2);
    expect(op(1)).toContain(String(2));
  });
});
});

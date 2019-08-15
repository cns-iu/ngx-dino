import { isOperator } from '../operator';
import { access } from './access';

describe('operators', () => {
describe('access(path)', () => {
  it('creates an Operator', () => {
    expect(isOperator(access(''))).toBeTruthy();
  });

  it('accesses the specified property', () => {
    const op = access('a');
    const obj = { a: 1 };
    expect(op(obj)).toEqual(obj.a);
  });
});

describe('access(path, default)', () => {
  it('creates an Operator', () => {
    expect(isOperator(access('', 0))).toBeTruthy();
  });

  it('accesses the specified property', () => {
    const op = access('a', 0);
    const obj = { a: 1 };
    expect(op(obj)).toEqual(obj.a);
  });

  it('uses the default value if the property does not exist', () => {
    const op = access('a', 0);
    expect(op({})).toEqual(0);
  });
});
});

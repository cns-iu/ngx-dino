import { isOperator } from '../operator';
import { map } from './map';

function empty() {}

describe('operators', () => {
describe('map(func)', () => {
  it('creates an Operator', () => {
    expect(isOperator(map(empty))).toBeTruthy();
  });

  it('applies the function when called', () => {
    const spy = jasmine.createSpy();
    const op = map(spy);
    op('unused');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
});

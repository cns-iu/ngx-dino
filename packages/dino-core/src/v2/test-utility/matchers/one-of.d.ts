declare namespace jasmine {
  interface Matchers<T> {
    toBeOneOf(expected: T[]): boolean;
  }
}

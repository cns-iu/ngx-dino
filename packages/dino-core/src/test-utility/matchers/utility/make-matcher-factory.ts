
export type Compare<T> = (
  util: jasmine.MatchersUtil,
  customEqualityTesters: jasmine.CustomEqualityTester[],
  actual: T,
  ...args: any[]
) => jasmine.CustomMatcherResult;

export function makeMatcherFactory<T>(
  compare: Compare<T>
): (
  util: jasmine.MatchersUtil,
  customEqualityTesters: jasmine.CustomEqualityTester[]
) => jasmine.CustomMatcher {
  return (util, testers) => {
    return {
      compare(actual: T, ...args: any[]) {
        return compare.call(this, util, testers, actual, ...args);
      }
    };
  };
}

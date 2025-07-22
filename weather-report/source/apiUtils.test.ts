import { sum } from '../source/apiUtils';

describe('sum util', () => {
  it('should add two numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });
});

import { getDiff, DiffOperation } from './index';

describe('Text difference', () => {
  describe('getDiff', () => {
    it('should calculate difference for two sets of tokens', () => {
      const testCases = [
        {
          before: ['Hello', 'world'],
          after: ['Aloha', 'world'],
          result: [
            [DiffOperation.Removed, ['Hello']],
            [DiffOperation.Added, ['Aloha']],
            [DiffOperation.Equals, ['world']]
          ]
        },
        {
          before: ['Hello', 'world'],
          after: ['Hello', 'world'],
          result: [[DiffOperation.Equals, ['Hello', 'world']]]
        },
        {
          before: ['Hello', 'world'],
          after: ['Hello', 'world', 'amigos'],
          result: [
            [DiffOperation.Equals, ['Hello', 'world']],
            [DiffOperation.Added, ['amigos']]
          ]
        },
        {
          before: [1, 2, 3, 4],
          after: [3, 4, 5, 6],
          result: [
            [DiffOperation.Removed, [1, 2]],
            [DiffOperation.Equals, [3, 4]],
            [DiffOperation.Added, [5, 6]]
          ]
        }
      ];

      testCases.forEach((
        { before, after, result } //
      ) => expect(getDiff<unknown>(before, after)).toEqual(result));
    });
  });
});

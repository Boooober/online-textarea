import { DiffOperation, getDiff, getTextDiff } from './index';

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
          before: ['great', 'world'],
          after: ['Aloha', 'great', 'world'],
          result: [
            [DiffOperation.Added, ['Aloha']],
            [DiffOperation.Equals, ['great', 'world']]
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
          before: ['Hello', 'world', 'world'],
          after: ['Hello', 'world', 'amigos'],
          result: [
            [DiffOperation.Equals, ['Hello', 'world']],
            [DiffOperation.Removed, ['world']],
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
      ) => expect(getDiff<string | number>(before, after)).toEqual(result));
    });
  });

  describe('getTextDiff', () => {
    it('should calculate difference for two strings', () => {
      const testCases = [
        {
          before: 'The quick brown  fox  ',
          after: 'The  slow  orange fox',
          result: [
            [DiffOperation.Equals, ['The']],
            [DiffOperation.Removed, [' ', 'quick', ' ', 'brown']],
            [DiffOperation.Equals, ['  ']],
            [DiffOperation.Removed, ['fox']],
            [DiffOperation.Added, ['slow']],
            [DiffOperation.Equals, ['  ']],
            [DiffOperation.Added, ['orange', ' ', 'fox']]
          ]
        }
      ];

      testCases.forEach((
        { before, after, result } //
      ) => expect(getTextDiff(before, after)).toEqual(result));
    });
  });
});

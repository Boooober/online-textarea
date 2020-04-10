import { DiffOperation, applyTextPatch, getDiff, getTextDiff, getPatch } from './index';

describe('Text difference', () => {
  describe('getDiff', () => {
    it('should calculate difference for two sets of tokens', () => {
      const testCases = [
        {
          before: [],
          after: ['Hello', 'world'],
          result: [[DiffOperation.Added, ['Hello', 'world']]]
        },
        {
          before: ['Hello', 'world'],
          after: [],
          result: [[DiffOperation.Removed, ['Hello', 'world']]]
        },
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
          before: 'The quick brown fox.',
          after: 'The slow orange fox.',
          result: [
            [DiffOperation.Equals, ['The', ' ']],
            [DiffOperation.Removed, ['quick']],
            [DiffOperation.Added, ['slow']],
            [DiffOperation.Equals, [' ']],
            [DiffOperation.Removed, ['brown']],
            [DiffOperation.Added, ['orange']],
            [DiffOperation.Equals, [' ', 'fox.']]
          ]
        },
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

  describe('getPatch', () => {
    const textPrefix = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ';
    const textSuffix = 'Vivamus vel pretium quam.';

    it("should leave only useful changes and provide it's limits", () => {
      // Probably we can replace it with tokenization by punctuation.
      const separator = ' ';
      const before = `The quick brown fox.${separator}`;
      const after = `Very slow orange squirrel!${separator}`;

      const fullBefore = `${textPrefix}${before}${textSuffix}`;
      const fullAfter = `${textPrefix}${after}${textSuffix}`;

      expect(getPatch(getTextDiff(fullBefore, fullAfter))).toEqual({
        from: textPrefix.length,
        to: textPrefix.length + before.length,
        updates: after
      });
    });

    it('should not replace the text if it is the same', () => {
      const before = `${textPrefix}The quick brown fox.${textSuffix}`;

      expect(getPatch(getTextDiff(before, before))).toEqual(null);
    });
  });

  describe('applyTextPatch', () => {
    it('should change text based on the provided patch', () => {
      const before = 'An apple a day keeps the doctor away';
      const after = 'The coronavirus every day keeps the people away';

      const textPrefix = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ';
      const textSuffix = 'Vivamus vel pretium quam.';

      const fullBefore = `${textPrefix}${before}${textSuffix}`;
      const fullAfter = `${textPrefix}${after}${textSuffix}`;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const patch = getPatch(getTextDiff(fullBefore, fullAfter))!;

      expect(applyTextPatch(fullBefore, patch)).toBe(fullAfter);
    });
  });
});

export enum DiffOperation {
  Added = '+',
  Removed = '-',
  Equals = '='
}

export type Difference<T> = [DiffOperation, T[]];
export interface Patch {
  from: number;
  to: number;
  updates: string;
}

type Token = string | number;
export function getDiff<T extends Token>(before: T[], after: T[]): Difference<T>[] {
  const reversIndexedBefore = before.reduce((result: { [key in T]: number[] }, token: T, index: number) => {
    const indices = result[token] || [];
    indices.push(index);

    return Object.assign(result, { [token]: indices });
  }, {} as { [key in T]: number[] });

  const overlapMatrix: Record<string, number> = {};
  let maxOverlapLength = 0;
  let oldIndexStart = 0;
  let newIndexStart = 0;

  for (let newIndex = 0; newIndex < after.length; newIndex += 1) {
    const matches = reversIndexedBefore[after[newIndex]] || [];
    // Here we assume that we found the match between the new tokens subsequence and the old one.
    for (let matchIndex = 0; matchIndex < matches.length; matchIndex += 1) {
      const oldIndex = matches[matchIndex];
      // Every iteration means that we have matched token from old sequence with the token from the new sequence.
      // We need to couple two token's indices from this sequences and start or continue match series.
      // Matching series will be represented with a length that takes in account previous indices couple.
      overlapMatrix[`${oldIndex}:${newIndex}`] = (overlapMatrix[`${oldIndex - 1}:${newIndex - 1}`] || 0) + 1;
      const overlapLength = overlapMatrix[`${oldIndex}:${newIndex}`];

      if (overlapLength > maxOverlapLength) {
        // This is the biggest subsequence ever seen so far.
        // Need to remember were it starts in every sequence.
        maxOverlapLength = overlapLength;
        oldIndexStart = oldIndex - overlapLength + 1;
        newIndexStart = newIndex - overlapLength + 1;
      }
    }
  }

  if (!maxOverlapLength) {
    // Nothing overlapped :(
    return [
      ...(before.length ? [[DiffOperation.Removed, before] as Difference<T>] : []),
      ...(after.length ? [[DiffOperation.Added, after] as Difference<T>] : [])
    ];
  }

  // Something overlapped.
  // Need to check recursively subsequences before and after this overlap
  return [
    ...getDiff(before.slice(0, oldIndexStart), after.slice(0, newIndexStart)),
    [DiffOperation.Equals, after.slice(newIndexStart, newIndexStart + maxOverlapLength)],
    ...getDiff(before.slice(oldIndexStart + maxOverlapLength), after.slice(newIndexStart + maxOverlapLength))
  ];
}

export const textTokenizer = (text: string): string[] => text.split(/(?<=\s+\b)|(?=\b\s+)/);
export const getTextDiff = (before: string, after: string): Difference<string>[] =>
  getDiff(textTokenizer(before), textTokenizer(after));

export const getPatch = (fullDiff: Difference<string>[]): Patch | null => {
  const isChanged = ([operation]: Difference<string>): boolean => operation !== DiffOperation.Equals;

  const fromDiff = fullDiff.findIndex(isChanged);

  if (fromDiff === -1) {
    // The difference is equal
    return null;
  }
  const toDiff = fullDiff.length - fullDiff.slice().reverse().findIndex(isChanged);

  const textSuffix = fullDiff
    .slice(0, fromDiff)
    .reduce((result: string, [, tokens]: Difference<string>) => `${result}${tokens.join('')}`, '');

  const { originalText, updatedText } = fullDiff.slice(fromDiff, toDiff).reduce(
    (result: { originalText: string; updatedText: string }, [operation, tokens]: Difference<string>) => {
      if ([DiffOperation.Equals, DiffOperation.Added].includes(operation)) {
        Object.assign(result, { updatedText: `${result.updatedText}${tokens.join('')}` });
      }
      if ([DiffOperation.Equals, DiffOperation.Removed].includes(operation)) {
        Object.assign(result, { originalText: `${result.originalText}${tokens.join('')}` });
      }

      return result;
    },
    { originalText: '', updatedText: '' }
  );

  const from = textSuffix.length;
  const to = from + originalText.length;

  return { from, to, updates: updatedText };
};

export const applyTextPatch = (text: string, { from, to, updates }: Patch): string => {
  const unchangedPrefix = text.slice(0, from);
  const unchangedSuffix = text.slice(to, text.length);

  return `${unchangedPrefix}${updates}${unchangedSuffix}`;
};

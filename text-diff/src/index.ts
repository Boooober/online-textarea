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

  const matches: { oldIndex: number; newIndex: number }[] = [];
  for (let newIndex = 0; newIndex < after.length; newIndex += 1) {
    const [oldIndex] = reversIndexedBefore[after[newIndex]] || [-1];
    // If old index exist, this means that we have a match.
    if (oldIndex >= 0) {
      matches.push({ oldIndex, newIndex });
    }

    // There are already few matches
    if (matches.length) {
      const [nextOldIndex] = reversIndexedBefore[after[newIndex + 1]] || [-1];

      if (nextOldIndex >= 0 && nextOldIndex === oldIndex + 1) {
        // Ok, we have another match
      } else {
        // Ooops, failed to match another word. Or this is the end.
        const matchLength = matches.length;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { oldIndex: firstOldIndex, newIndex: fistNewIndex } = matches.shift()!;

        return [
          ...getDiff(before.slice(0, firstOldIndex), after.slice(0, fistNewIndex)),
          [DiffOperation.Equals, after.slice(fistNewIndex, fistNewIndex + matchLength)],
          ...getDiff(before.slice(firstOldIndex + matchLength), after.slice(fistNewIndex + matchLength))
        ];
      }
    }
    // Keep searching for matches
  }

  return matches.length
    ? [[DiffOperation.Equals, after]]
    : [
        ...(before.length ? [[DiffOperation.Removed, before] as Difference<T>] : []),
        ...(after.length ? [[DiffOperation.Added, after] as Difference<T>] : [])
      ];
}

const textTokenizer = (text: string): string[] => text.split(/(?<=\s+\b)|(?=\b\s+)/);
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

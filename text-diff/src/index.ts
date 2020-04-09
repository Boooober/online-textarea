export enum DiffOperation {
  Added = '+',
  Removed = '-',
  Equals = '='
}

type Difference<T> = [DiffOperation, T[]];

type Token = string | number;
export function getDiff<T extends Token>(before: T[], after: T[]): Difference<T>[] {
  const reversIndexedBefore = before.reduce((result: { [key in T]: number[] }, token: T, index: number) => {
    const indices = result[token] || [];
    indices.push(index);

    return Object.assign(result, { [token]: indices });
  }, {} as { [key in T]: number[] });

  const matches: { oldIndex: number; newIndex: number }[] = [];
  for (let newIndex = 0; newIndex < after.length; newIndex += 1) {
    const [oldIndex] = reversIndexedBefore[after[newIndex]] || [];
    // If old index exist, this means that we have a match.
    if (oldIndex >= 0) {
      matches.push({ oldIndex, newIndex });
    }

    // There are already few matches
    if (matches.length) {
      const [nextOldIndex] = reversIndexedBefore[after[newIndex + 1]] || [];

      if (nextOldIndex && nextOldIndex === oldIndex + 1) {
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

export const getTextDiff = (before: string, after: string): Difference<string>[] =>
  getDiff(before.split(' '), after.split(' '));

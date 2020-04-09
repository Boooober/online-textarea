export enum DiffOperation {
  Added = '+',
  Removed = '-',
  Equals = '='
}

interface Difference<T> {
  [DiffOperation.Added]?: T[];
  [DiffOperation.Removed]?: T[];
  [DiffOperation.Equals]?: T[];
}

export const getDiff = <T = unknown>(before: T[], after: T[]): Difference<T>[] => {
  return [];
};

export const getTextDiff = (before: string, after: string): Difference<string>[] =>
  getDiff(before.split(' '), after.split(' '));

// returns elements in either, excluding common ones

export function arraysSymmetricDifference<T>(arr1: T[], arr2: T[]): T[] {
  return [...new Set(arr1).symmetricDifference(new Set(arr2))];
}

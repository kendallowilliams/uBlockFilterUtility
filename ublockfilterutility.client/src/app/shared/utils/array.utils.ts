export class ArrayUtils {
    public static removeDuplicates<T>(items: T[]): T[] {
        return items
            ? items.filter((item, index) => items.indexOf(item) === index)
            : items;
    }
}
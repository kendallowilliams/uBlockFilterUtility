export class ArrayUtils {
    public static removeDuplicates<T>(items: T[]): T[] {
        return items
            ? items.filter((item, index) => items.indexOf(item) === index)
            : items;
    }

    public static sort<T>(items: T[], compareFn: (iThis: T, iThat: T) => number): T[] {
        const arr = Array.from(items);

        arr.sort(compareFn);

        return arr;
    }
}

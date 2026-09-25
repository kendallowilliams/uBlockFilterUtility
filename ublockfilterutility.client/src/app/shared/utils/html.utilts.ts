import * as uuid from 'uuid';

export class HtmlUtils {
    public static generateId: () => string = (): string => `_${uuid.v4()}`;
}
import { defaultIfEmpty, map, Observable, of } from 'rxjs';
import * as uuid from 'uuid';

export class HtmlUtils {
    public static generateId: () => string = (): string => `_${uuid.v4()}`;

    public static getIdGenerator: () => Observable<string> = 
        (): Observable<string> => of().pipe(defaultIfEmpty(null), map(() => HtmlUtils.generateId()));
}
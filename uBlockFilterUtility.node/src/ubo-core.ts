import { AstFilterParser } from '@gorhill/ubo-core/js/static-filtering-parser';

export class UboCore {
    public isValid(input: string): boolean {
        const parser = new AstFilterParser();

        parser.parse(input);
        
        return !parser.hasError();
    }
}
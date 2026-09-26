import { FilterParameter, FilterParameters } from '../models/filter-parameter.model';
import { ArrayUtils } from '../utils/array.utils';

export class FilterUtils {
    public static hasMissingParameters(template: string, params: FilterParameter[]): boolean {
        if (!template || !params) return false;

        const requiredKeys = template.match(/(?<=\{).*?(?=\})/g);
        const existingKeys = params.map(p => p.key);
        
        return !!requiredKeys?.some(key => !existingKeys?.includes(key));
    }

    public static getMissingParameters(template: string, params: FilterParameter[]): string[] {
        if (!template || !params) return [];

        const requiredKeys = ArrayUtils.removeDuplicates(template.match(/(?<=\{).*?(?=\})/g) || []).sort();
        const existingKeys = params.map(p => p.key);

        return requiredKeys.filter(key => !existingKeys?.includes(key)).map(key => key);
    }

    public static toParameterArray(parameters: FilterParameters): FilterParameter[] {
        parameters = parameters || {};
        return Object.keys(parameters)
            .sort()
            .map(key => ({key, value: parameters[key]})
        );
    }

    public static fromParameterArray(parameterArray: FilterParameter[]): FilterParameters {
        const parameters: FilterParameters = {};

        parameterArray = parameterArray || [];
        parameterArray.forEach(p => parameters[p.key] = p.value);

        return parameters;
    }

    public static isDuplicateKey(key: string, params: FilterParameter[]): boolean {
        if (!key || !params) return false;
        
        return params.some(p => p.key.trim().localeCompare(key.trim()) === 0);
    }
}
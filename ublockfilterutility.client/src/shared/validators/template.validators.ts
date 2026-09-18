import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FilterParameter } from '../models/param.model';
import { ArrayUtils } from '../utils/array.utils';

export function missingParameters(paramFn: () => FilterParameter[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        return hasMissingParameters(control.value, paramFn?.()) ? { missingParameters: true } : null
    }
}

function hasMissingParameters(template: string, params: FilterParameter[]): boolean {
    if (!template || !params) return false;

    const requiredKeys = template.match(/(?<=\{).*?(?=\})/g);
    const existingKeys = params.map(p => p.key);
    
    return !!requiredKeys?.some(key => !existingKeys?.includes(key));
}

export function getMissingParameters(template: string, params: FilterParameter[]): string[] {
    if (!template || !params) return [];

    const requiredKeys = ArrayUtils.removeDuplicates(template.match(/(?<=\{).*?(?=\})/g) || []).sort();
    const existingKeys = params.map(p => p.key);

    return requiredKeys.filter(key => !existingKeys?.includes(key)).map(key => key);
}
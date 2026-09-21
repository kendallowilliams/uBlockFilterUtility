import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FilterParameter } from '../models/param.model';

export function uniqueKey(paramFn: () => FilterParameter[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
        isDuplicateKey(control.value, paramFn?.()) ? {duplicate: true} : null;
}

function isDuplicateKey(key: string, params: FilterParameter[]): boolean {
    if (!key || !params) return false;
    
    return params.some(p => p.key.trim().localeCompare(key.trim()) === 0);
}
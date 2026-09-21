import { KeyValue } from "@angular/common";
import { FormControl } from "@angular/forms";

export type FilterParameter = KeyValue<string, string>;

export interface FilterParameterForm {
    Key: FormControl<string | null>,
    Value: FormControl<string | null>
};
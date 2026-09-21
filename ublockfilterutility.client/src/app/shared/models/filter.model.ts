import { FormControl } from "@angular/forms";

export interface FilterModel {
    Id: number | null;
    Name: string | null;
    Parameters: {[key: string]: string},
    Template: string;
}

export interface FilterModelForm {
    Id: FormControl<number | null>;
    Name: FormControl<string | null>;
    Parameters: FormControl<{[key: string]: string} | null>;
    Template: FormControl<string | null>;
}

export interface ApiFilterRequest {
    id?: string;
    filter: FilterModel;
}
import { FormControl } from "@angular/forms";
import { FilterParameters } from "./filter-parameter.model";

export interface FilterModel {
    Id: number;
    Name: string;
    Parameters: FilterParameters;
    Template: string;
}

export interface ApiFilterRequest {
    id?: string;
    filter: FilterModel;
}
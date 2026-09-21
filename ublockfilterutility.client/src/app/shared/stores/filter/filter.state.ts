import { FilterModel } from "../../models/filter.model";

export interface FilterState {
    filters: FilterModel[];
    idMappings: {[localId: string]: FilterModel},
    loading: boolean;
}
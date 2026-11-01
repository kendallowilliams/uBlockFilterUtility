import { FilterModel } from "../../models/filter.model";
import { ScriptletModel } from "../../models/scriptlet.model";

export interface FilterState {
    filters: FilterModel[];
    scriptlet: ScriptletModel | null;
    idMappings: {[localId: string]: FilterModel},
    loading: boolean;
}
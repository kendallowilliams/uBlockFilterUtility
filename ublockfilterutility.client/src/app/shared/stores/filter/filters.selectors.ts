import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FilterState } from "./filter.state";
import { FILTER_REDUCER_KEY } from "./filters.reducer";
import { ArrayUtils } from "../../utils/array.utils";

export const selectFiltersState = createFeatureSelector<FilterState>(FILTER_REDUCER_KEY);
  
export const selectFilters = createSelector(
    selectFiltersState,
    (state: FilterState) => 
        ArrayUtils.sort(state.filters, (fThis, fThat) => fThis.Name?.localeCompare(fThat.Name!)!)
);

export const selectIdMappings = createSelector(
    selectFiltersState,
    (state: FilterState) => state.idMappings
)
  
export const selectFiltersLoading = createSelector(
    selectFiltersState,
    (state: FilterState) => state.loading
);
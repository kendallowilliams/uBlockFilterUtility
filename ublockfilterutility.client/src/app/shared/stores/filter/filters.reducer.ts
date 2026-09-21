import { createReducer, on } from "@ngrx/store";
import { FiltersApiActions } from "./filters.actions";
import { FilterState } from "./filter.state";

export const FILTER_REDUCER_KEY = 'filters';

export const initialState: FilterState = {
    filters: [],
    idMappings: {},
    loading: false
};

export const filtersReducers = createReducer(
    initialState,
    on(FiltersApiActions.getFilters, _state => ({..._state, loading: true})),
    on(FiltersApiActions.getFiltersSuccess, (_state, {filters}) => ({..._state, filters, loading: false})),
    on(FiltersApiActions.addFilter, _state => ({..._state, loading: true})),
    on(FiltersApiActions.addFilterSuccess, (_state, {filter, localId}) => {
        const updatedFilters = _state.filters.concat(filter);
        const mappings = Object.assign({}, _state.idMappings, {[localId]: filter})
        return {
            ..._state, 
            filters: updatedFilters, 
            loading: false, 
            idMappings: mappings
        };
    }),
    on(FiltersApiActions.updateFilter, _state => ({..._state, loading: true})),
    on(FiltersApiActions.updateFilterSuccess, (_state, {filter, localId}) => {
        const updatedFilters = _state.filters.filter(f => f.Id !== filter.Id).concat(filter);
        const mappings = Object.assign({}, _state.idMappings, {[localId]: filter});
        return {
            ..._state, 
            filters: updatedFilters,
            idMappings: mappings,
            loading: false
        };
    }),
    on(FiltersApiActions.deleteFilter, _state => ({..._state, loading: true})),
    on(FiltersApiActions.deleteFilterSuccess, (_state, {id}) => 
        ({..._state, filters: _state.filters.filter(f => f.Id !== id), loading: false})
    )
);
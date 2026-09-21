import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ApiFilterRequest, FilterModel } from '../../models/filter.model';

export const FiltersApiActions = createActionGroup({
    source: 'Filters/API',
    events: {
        'Add Filter': props<{request: ApiFilterRequest}>(),
        'Add Filter Success': props<{filter: FilterModel, localId: string}>(),
        'Update Filter': props<{request: ApiFilterRequest}>(),
        'Update Filter Success': props<{filter: FilterModel, localId: string}>(),
        'Delete Filter': props<{id: number}>(),
        'Delete Filter Success': props<{id: number}>(),
        'Get Filters': emptyProps(),
        'Get Filters Success': props<{filters: FilterModel[]}>()
    }
});
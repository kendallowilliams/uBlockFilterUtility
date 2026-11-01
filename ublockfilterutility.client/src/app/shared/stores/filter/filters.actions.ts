import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ApiFilterRequest, FilterModel } from '../../models/filter.model';
import { ScriptletModel } from '../../models/scriptlet.model';

export const FiltersApiActions = createActionGroup({
    source: 'Filters/API',
    events: {
        'Add Filter': props<{request: ApiFilterRequest}>(),
        'Add Filter Success': props<{filter: FilterModel, localId: string}>(),
        'Add Filter Failure': props<{error: string}>(),
        'Update Filter': props<{request: ApiFilterRequest}>(),
        'Update Filter Success': props<{filter: FilterModel, localId: string}>(),
        'Update Filter Failure': props<{error: string}>(),
        'Delete Filter': props<{id: number}>(),
        'Delete Filter Success': props<{id: number}>(),
        'Delete Filter Failure': props<{error: string}>(),
        'Get Filters': emptyProps(),
        'Get Filters Success': props<{filters: FilterModel[]}>(),
        'Get Filters Failure': props<{error: string}>(),

        'Get Scriptlet': emptyProps(),
        'Get Scriptlet Success': props<{scriptlet: ScriptletModel}>(),
        'Get Scriptlet Failure': props<{error: string}>(),

        'Update Scriptlet': props<{scriptlet: string}>(),
        'Update Scriptlet Success': props<{scriptlet: ScriptletModel}>(),
        'Update Scriptlet Failure': props<{error: string}>()
    }
});
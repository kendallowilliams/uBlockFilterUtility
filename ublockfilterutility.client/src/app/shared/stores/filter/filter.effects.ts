import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FilterService } from '../../services/filter.service';
import { FiltersApiActions } from './filters.actions';
import { map, switchMap } from 'rxjs';
import { FilterModel } from '../../models/filter.model';

@Injectable()
export class FilterEffects {
    private actions$ = inject(Actions);

    constructor(private filterService: FilterService) {}

    public getFilters$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FiltersApiActions.getFilters),
            switchMap(() =>
                this.filterService.getFilters()
                    .pipe(
                        map((filters: FilterModel[]) => FiltersApiActions.getFiltersSuccess({filters}))
                    )
            )
        ));

    public addFilter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FiltersApiActions.addFilter),
            switchMap(state =>
                this.filterService.addFilter(state.request.filter)
                    .pipe(
                        map((filter: FilterModel) => FiltersApiActions.addFilterSuccess({filter, localId: state.request.id!}))
                    )
            )
        ));

    public updateFilter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FiltersApiActions.updateFilter),
            switchMap(state =>
                this.filterService.updateFilter(state.request.filter)
                    .pipe(
                        map((filter: FilterModel) => FiltersApiActions.updateFilterSuccess({filter, localId: state.request.id!}))
                    )
            )
        ));

    public deleteFilter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FiltersApiActions.deleteFilter),
            switchMap(state =>
                this.filterService.deleteFilter(state.id)
                    .pipe(
                        map((success: boolean) => FiltersApiActions.deleteFilterSuccess({id: state.id}))
                    )
            )
        ));
}
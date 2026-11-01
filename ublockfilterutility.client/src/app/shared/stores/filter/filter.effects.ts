import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FilterService } from '../../services/filter.service';
import { FiltersApiActions } from './filters.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { FilterModel } from '../../models/filter.model';
import { MessageBoxService } from '../../services/message-box.service';
import { ScriptletModel } from '../../models/scriptlet.model';

@Injectable()
export class FilterEffects {
    private actions$ = inject(Actions);

    constructor(private filterService: FilterService, private messageBoxService: MessageBoxService) {}

    public getFilters$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FiltersApiActions.getFilters),
            switchMap(() =>
                this.filterService.getFilters()
                    .pipe(
                        map((filters: FilterModel[]) => FiltersApiActions.getFiltersSuccess({filters})),
                        catchError(() => of(FiltersApiActions.addFilterFailure({error: 'Failed to get filters.'})))
                    )
            )
        ));

    public addFilter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FiltersApiActions.addFilter),
            switchMap(state =>
                this.filterService.addFilter(state.request.filter)
                    .pipe(
                        map((filter: FilterModel) => FiltersApiActions.addFilterSuccess({filter, localId: state.request.id!})),
                        catchError(() => of(FiltersApiActions.addFilterFailure({error: 'Failed to add filter.'})))
                    )
            )
        ));

    public updateFilter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FiltersApiActions.updateFilter),
            switchMap(state =>
                this.filterService.updateFilter(state.request.filter)
                    .pipe(
                        map((filter: FilterModel) => FiltersApiActions.updateFilterSuccess({filter, localId: state.request.id!})),
                        catchError(() => of(FiltersApiActions.addFilterFailure({error: 'Failed to update filter.'})))
                    )
            )
        ));

    public deleteFilter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FiltersApiActions.deleteFilter),
            switchMap(state =>
                this.filterService.deleteFilter(state.id)
                    .pipe(
                        map((success: boolean) => FiltersApiActions.deleteFilterSuccess({id: state.id})),
                        catchError(() => of(FiltersApiActions.addFilterFailure({error: 'Failed to delete filter.'})))
                    )
            )
        ));

    public errors$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                FiltersApiActions.addFilterFailure, 
                FiltersApiActions.deleteFilterFailure,
                FiltersApiActions.updateFilterFailure,
                FiltersApiActions.getFiltersFailure
            ), tap(state => this.messageBoxService.error({
                    title: 'API Error',
                    message: state.error
                })
            )
        ), {
            dispatch: false
        });

    public getScriptlet$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FiltersApiActions.getScriptlet),
            switchMap(() =>
                this.filterService.getScriptlet()
                    .pipe(
                        map((scriptlet: ScriptletModel) => FiltersApiActions.getScriptletSuccess({scriptlet})),
                        catchError(() => of(FiltersApiActions.getScriptletFailure({error: 'Failed to get scriptlet.'})))
                    )
            )
        ));

    public updateScriptlet$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FiltersApiActions.updateScriptlet),
            switchMap(state =>
                this.filterService.updateScriptlet(state.scriptlet)
                    .pipe(
                        map((scriptlet: ScriptletModel) => FiltersApiActions.updateScriptletSuccess({scriptlet})),
                        catchError(() => of(FiltersApiActions.updateScriptletFailure({error: 'Failed to update scriptlet.'})))
                    )
            )
        ));
}
import { Component, computed, DestroyRef, effect, inject, OnInit, Signal, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { faCopy, faEye, faFileExport, faPlus, faSave, faSpinner, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FilterModel } from '../../shared/models/filter.model';
import { FilterModalComponent } from '../modals/filter-modal/filter-modal.component';
import { finalize, Observable, Subject, take, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { FiltersApiActions } from '../../shared/stores/filter/filters.actions';
import { selectFilters, selectFiltersLoading, selectIdMappings } from '../../shared/stores/filter/filters.selectors';
import { FilterService } from '../../shared/services/filter.service';
import { FilterState } from '../../shared/stores/filter/filter.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FilterComponent } from '../filter/filter.component';
import { MessageBoxService } from '../../shared/services/message-box.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalConfig } from '../../shared/models/modal-config.model';
import { MessageBoxModalComponent } from '../modals/message-box-modal/message-box-modal.component';
import { HtmlUtils } from '../../shared/utils/html.utilts';
import { ThemeService } from '../../shared/services/theme.service';
import { FieldState, FieldTree, form, required, validate } from '@angular/forms/signals';
import { FilterUtils } from '../../shared/utils/filter.utils';
import { InjectionContextService } from '../../shared/services/injection-context.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'dashboard.component.html',
    standalone: false
})
export class DashboardComponent implements OnInit {
    @ViewChild('filterContainer', {read: ViewContainerRef, static: true}) private filterContainer!: ViewContainerRef;

    protected selectedFilter = signal<FilterModel | null>(null);
    protected faSave = faSave;
    protected faCopy = faCopy;
    protected faTrash = faTrash;
    protected faEye = faEye;
    protected faPlus = faPlus;
    protected faFileExport = faFileExport;
    protected faSpinner = faSpinner;
    protected faUndo = faUndo;
    protected isLoading = signal<boolean>(false);
    protected filters$?: Observable<FilterModel[]>;
    protected filters: FilterModel[] = [];
    protected readonly exportUrl?: string;
    protected filterForm: Signal<FieldTree<FilterModel>>;
    protected filterFormState: FieldTree<FilterModel>;
    protected paramsChanged = signal<boolean>(false);
    protected idGenerator$: Observable<string> = HtmlUtils.getIdGenerator();
    protected darkModeEnabled = signal<boolean>(false);
    protected isEditing = computed(() => this.filterFormState().dirty());
    protected canSave = computed(() => this.filterFormState().valid());

    private destroyRef = inject(DestroyRef);
    private selectedFilterLocalId: string | null = null;
    private get initialModel(): FilterModel {
        return {Id: 0, Name: '', Parameters: {}, Template: ''};
    }

    constructor(
        private bsModal: BsModalService,
        private store: Store<FilterState>, 
        private filterService: FilterService,
        private messageBoxService: MessageBoxService,
        private themeService: ThemeService,
        private injectionContextService: InjectionContextService
    ) {
        this.exportUrl = this.filterService.getExportUrl();
        effect(() => {
            this.loadSelectedFilter(this.selectedFilter());
        });
        this.themeService.getDarkModeEnabled()
            .pipe(take(1))
            .subscribe(enabled => this.darkModeEnabled.set(enabled));
        effect(() => {
            this.themeService.setDarkMode(this.darkModeEnabled());
        });
        this.filterForm = signal<FieldTree<FilterModel>>(this.getFilterForm());
        this.filterFormState = this.filterForm();
    }
    
    public ngOnInit(): void {
        this.store.dispatch(FiltersApiActions.getFilters());
        this.filters$ = this.store.select(selectFilters);
        this.store.select(selectFiltersLoading)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(loading => this.isLoading.set(loading));
        this.store.select(selectIdMappings)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(mappings => {
                const filter = this.selectedFilterLocalId ? mappings[this.selectedFilterLocalId] : null;
                this.selectedFilter.set(filter);
                this.selectedFilterLocalId = null;
            });
    }

    protected handleAdd(): void {
        const addFn = () => {
            const destroySub = new Subject<void>();
            const filterForm = this.getFilterForm(null);
            const context: ModalOptions<FilterModalComponent> = {
                class: 'modal-lg modal-dialog-centered'
            };
            const modalRef = this.bsModal.show(FilterModalComponent, context);

            modalRef.content?.form.set(filterForm);
            this.selectedFilterLocalId = HtmlUtils.generateId();
            modalRef.content?.addFilter
                .subscribe(() => {
                    const request = {
                        id: this.selectedFilterLocalId!,
                        filter: filterForm().value()
                    };
                    this.store.dispatch(FiltersApiActions.addFilter({request}));
                });
            modalRef.onHidden?.pipe(takeUntil(destroySub)).subscribe(() => destroySub.next());
        };

        if (this.filterFormState().dirty()) {
            const modalConfig: ModalConfig<MessageBoxModalComponent> = {
                options: {
                    class: 'modal-lg modal-dialog-centered',
                    initialState: {
                        context: { 
                            title: 'Unsaved Changes', 
                            message: 'Are you sure you want to leave? Unsaved changes will be lost.'
                        }
                    }
                }
            };

            this.messageBoxService.warn(modalConfig).subscribe(proceed => proceed && addFn());
        } else {
            addFn();
        }
    }

    protected handleUpdate(): void {
        const localId = HtmlUtils.generateId();
        const request = {
            id: localId,
            filter: this.filterFormState().value()
        };
        this.selectedFilterLocalId = localId;
        this.store.dispatch(FiltersApiActions.updateFilter({request}));
    }

    protected handleCopy(): void {
        const copyFn = () => {
            const destroySub = new Subject<void>();
            const filterForm = this.getFilterForm({...this.selectedFilter()!, Name: '', Id: 0});
            const context: ModalOptions<FilterModalComponent> = {
                class: 'modal-lg modal-dialog-centered'
            };
            const modalRef = this.bsModal.show(FilterModalComponent, context);

            modalRef.content?.form.set(filterForm);
            modalRef.content?.isCopy.set(true);
            this.selectedFilterLocalId = HtmlUtils.generateId();
            modalRef.content?.copyFilter
                .subscribe(() => {
                    const request = {
                        id: this.selectedFilterLocalId!,
                        filter: filterForm().value()
                    };
                    this.store.dispatch(FiltersApiActions.addFilter({request}));
                });
            modalRef.onHidden?.pipe(takeUntil(destroySub)).subscribe(() => destroySub.next());
        };

        if (this.filterFormState().dirty()) {
            const modalConfig: ModalConfig<MessageBoxModalComponent> = {
                options: {
                    class: 'modal-lg modal-dialog-centered',
                    initialState: {
                        context: { 
                            title: 'Unsaved Changes', 
                            message: 'Are you sure you want to leave? Unsaved changes will be lost.'
                        }
                    }
                }
            };

            this.messageBoxService.warn(modalConfig).subscribe(proceed => proceed && copyFn());
        } else {
            copyFn();
        }
    }

    protected handlePreview(): void {
        const filter = this.selectedFilter()!;

        this.isLoading.set(true);
        this.filterService.getPreview(filter.Id!)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe(preview => {
                this.messageBoxService.alert({
                    options: {
                        class: 'modal-lg modal-dialog-centered',
                        initialState: {
                            context: {
                                title: `"${filter.Name!}" Preview`,
                                message: preview
                            }
                        }
                    }
                });
            });
    }

    protected handleDelete(): void {
        const filterToDelete = this.selectedFilter()!;
        const title = `Delete "${filterToDelete.Name}"`;
        const message = `Are you sure you want to delete "${filterToDelete.Name}"?`;
        const modalConfig: ModalConfig<MessageBoxModalComponent> = {
            options: {
                class: 'modal-lg modal-dialog-centered',
                initialState: {
                    context: { title, message }
                }
            }
        };

        this.messageBoxService.warn(modalConfig)
            .subscribe((proceed: boolean): void => {
                if (proceed) {
                    this.store.dispatch(FiltersApiActions.deleteFilter({id: filterToDelete.Id!}));
                    this.selectedFilter.set(null);
                }
            });
    }

    protected handleUndo(): void {
        const selectedFilter = this.selectedFilter();

        this.selectedFilter.set(null);
        this.selectedFilter.set(selectedFilter);
    }

    private getFilterForm(filter?: FilterModel | null): FieldTree<FilterModel> {
        let _form!: FieldTree<FilterModel>;
        this.injectionContextService.runInInjectionContext(() => {
            const model = signal(filter || this.initialModel);
            _form = form(model, schema => {
                required(schema.Name),
                required(schema.Template),
                validate(schema.Template, ({value, valueOf}) => {
                    const parameters = FilterUtils.toParameterArray(valueOf(schema.Parameters)) || [];
                    return FilterUtils.hasMissingParameters(value(), parameters) 
                        ? 
                        {
                            kind: 'missing-parameters', 
                            message: FilterUtils.getMissingParameters(value(), parameters).join(', ')
                        } 
                        : null
                    }
                )
            });
        });

        return _form;
    }

    private loadSelectedFilter(filter: FilterModel | null): void {
        this.filterContainer?.clear();

        if (filter) {
            const componentRef = this.filterContainer.createComponent(FilterComponent);
            
            this.filterFormState().reset(filter);
            componentRef.instance.form.set(this.filterForm());
            componentRef.instance.isEdit.set(true);
            this.getIsFilterValid(filter.Id!, (isValid) => componentRef.instance.isFilterValid.set(isValid));
        }
    }

    private getIsFilterValid(id: number, callbackFn: (isValid: boolean) => void): void {
        this.isLoading.set(true);
        this.filterService.isFilterValid(id)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe(valid => callbackFn?.(valid));
    }
}

import { Component, DestroyRef, effect, inject, OnInit, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { faCopy, faEye, faFileExport, faPlus, faSave, faSpinner, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FilterModel, FilterModelForm } from '../../shared/models/filter.model';
import { FilterModalComponent } from '../modals/filter-modal/filter-modal.component';
import { finalize, Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { FiltersApiActions } from '../../shared/stores/filter/filters.actions';
import { selectFilters, selectFiltersLoading, selectIdMappings } from '../../shared/stores/filter/filters.selectors';
import { FilterService } from '../../shared/services/filter.service';
import { FilterState } from '../../shared/stores/filter/filter.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { missingParameters } from '../../shared/validators/template.validators';
import { FilterComponent } from '../filter/filter.component';
import { FilterParameter } from '../../shared/models/param.model';
import { MessageBoxService } from '../../shared/services/message-box.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalConfig } from '../../shared/models/modal-config.model';
import { MessageBoxModalComponent } from '../modals/message-box-modal/message-box-modal.component';
import { HtmlUtils } from '../../shared/utils/html.utilts';

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
    protected filterForm = signal<FormGroup<FilterModelForm> | null>(null);

    private destroyRef = inject(DestroyRef);
    private selectedFilterLocalId: string | null = null;

    constructor(
        private bsModal: BsModalService,
        private store: Store<FilterState>, 
        private filterService: FilterService,
        private fb: FormBuilder,
        private messageBoxService: MessageBoxService
    ) {
        const destroySub = new Subject<void>();

        this.exportUrl = this.filterService.getExportUrl();
        effect(() => {
            destroySub.next();
            this.loadSelectedFilter(this.selectedFilter(), destroySub);
        });
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
            const filterForm = this.getFilterForm(null, destroySub);
            const context: ModalOptions<FilterModalComponent> = {
                class: 'modal-lg modal-dialog-centered',
                initialState: {
                    form: filterForm
                }
            };
            const modalRef = this.bsModal.show(FilterModalComponent, context);

            this.selectedFilterLocalId = HtmlUtils.generateId();
            modalRef.content?.addFilter
                .subscribe(() => {
                    const request = {
                        id: this.selectedFilterLocalId!,
                        filter: filterForm?.getRawValue()! as FilterModel
                    };
                    this.store.dispatch(FiltersApiActions.addFilter({request}));
                });
            modalRef.onHidden?.pipe(takeUntil(destroySub)).subscribe(() => destroySub.next());
        };

        if (this.filterForm()?.dirty) {
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
            filter: this.filterForm()?.getRawValue()! as FilterModel
        };
        this.selectedFilterLocalId = localId;
        this.store.dispatch(FiltersApiActions.updateFilter({request}));
    }

    protected handleCopy(): void {
        const copyFn = () => {
            const destroySub = new Subject<void>();
            const filterForm = this.getFilterForm({...this.selectedFilter()!, Name: null, Id: null}, destroySub);
            const context: ModalOptions<FilterModalComponent> = {
                class: 'modal-lg modal-dialog-centered',
                initialState: {
                    form: filterForm,
                    isCopy: true
                }
            };
            const modalRef = this.bsModal.show(FilterModalComponent, context);

            this.selectedFilterLocalId = HtmlUtils.generateId();
            modalRef.content?.copyFilter
                .subscribe(() => {
                    const request = {
                        id: this.selectedFilterLocalId!,
                        filter: filterForm?.getRawValue()! as FilterModel
                    };
                    this.store.dispatch(FiltersApiActions.addFilter({request}));
                });
            modalRef.onHidden?.pipe(takeUntil(destroySub)).subscribe(() => destroySub.next());
        };

        if (this.filterForm()?.dirty) {
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

    private getFilterForm(initialValue: FilterModel | null = null, destroySub: Subject<void>): FormGroup<FilterModelForm> {
        let parameters: FilterParameter[] = [];
        const form = this.fb.group<FilterModelForm>({
            Id: this.fb.control(null),
            Name: this.fb.control(null, Validators.required),
            Template: this.fb.control(null, [Validators.required, missingParameters(() => parameters)]),
            Parameters: this.fb.control(null)
        });

        form.controls['Parameters'].valueChanges
            .pipe(takeUntil(destroySub))
            .subscribe(params => {
                const template = form.controls['Template'];
                parameters = Object.keys(params || {}).map(key => ({key, value: params![key]}));
                template.updateValueAndValidity();
            });
        if (initialValue) form.reset(initialValue);

        return form;
    }

    private loadSelectedFilter(filter: FilterModel | null, destroySub: Subject<void>): void {
        this.filterContainer?.clear();
        this.filterForm.set(null);

        if (filter) {
            const componentRef = this.filterContainer.createComponent(FilterComponent);
            const filterForm = this.getFilterForm(filter, destroySub);
            
            this.filterForm.set(filterForm);
            componentRef.setInput('form', filterForm);
            componentRef.setInput('isEdit', true);

            this.getIsValid(filter.Id!, (isValid) => componentRef.setInput('isValid', isValid));
        }
    }

    private getIsValid(id: number, callbackFn: (isValid: boolean) => void): void {
        this.isLoading.set(true);
        this.filterService.isFilterValid(id)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe(valid => callbackFn?.(valid));
    }
}

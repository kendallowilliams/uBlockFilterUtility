import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { faCopy, faEye, faFileExport, faPlus, faSave, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FilterModel } from '../../shared/models/filter.model';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { FilterModalComponent } from '../modals/filter-modal/filter-modal.component';
import { FilterService } from '../../shared/services/filter.service';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { BehaviorSubject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'dashboard.component.html',
    standalone: false
})
export class DashboardComponent implements OnInit {
    protected $filters = new BehaviorSubject<FilterModel[]>([]);
    protected $selectedFilter = new BehaviorSubject<FilterModel | null>(null);

    protected faSave = faSave;
    protected faCopy = faCopy;
    protected faTrash = faTrash;
    protected faEye = faEye;
    protected faPlus = faPlus;
    protected faFileExport = faFileExport;
    protected faSpinner = faSpinner;
    protected $isLoading = new BehaviorSubject<boolean>(false);

    private destroyRef = inject(DestroyRef);
    private filters: FilterModel[] = [];

    constructor(private bsModal: BsModalService, private filterService: FilterService) {}
    
    public ngOnInit(): void {
        this.$isLoading.next(true);
        this.$filters
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(filters => this.filters = filters);
        this.filterService.getFilters()
            .pipe(tap(filters => {
                this.$filters.next(filters);
                this.$isLoading.next(false);
            }))
            .subscribe();
    }

    protected handleAdd(): void {
        const context: ModalOptions<FilterModalComponent> = {
            class: 'modal-lg modal-dialog-centered'
        };
        const modalRef = this.bsModal.show(FilterModalComponent, context);

      modalRef.content?.addFilter
        .subscribe(filter => {
            this.$isLoading.next(true);
            this.filterService.addFilter(filter!)
                .subscribe(filter => {
                    this.updateFilters([...this.filters!, filter]);
                    this.$selectedFilter.next(filter);
                    this.$isLoading.next(false);
                });
        });
    }

    protected handleSave(): void {
        this.$isLoading.next(true);
        this.filterService.updateFilter(this.$selectedFilter.getValue()!)
            .subscribe(filter => {
                const fIndex = this.filters!.findIndex(f => f.Id === filter.Id);
                this.filters!.splice(fIndex, 1, filter);
                this.$selectedFilter.next(filter);
                this.$isLoading.next(false);
            });
    }

    protected handleCopy(): void {
        const context: ModalOptions<FilterModalComponent> = {
            class: 'modal-lg modal-dialog-centered',
            initialState: {
                filter: this.$selectedFilter.getValue()
            }
        };
        const modalRef = this.bsModal.show(FilterModalComponent, context);

      modalRef.content?.copyFilter
        .subscribe(filter => {
            this.$isLoading.next(true);
            this.filterService.addFilter(filter!)
                .subscribe(filter => {
                    this.updateFilters([...this.filters!, filter]);
                    this.$selectedFilter.next(filter);
                    this.$isLoading.next(false);
                });
        });
    }

    protected handlePreview(): void {
        const id = this.$selectedFilter.getValue()?.Id!;

        this.$isLoading.next(true);
        this.filterService.getPreview(id)
            .subscribe(preview => {
                console.info(preview);
                this.$isLoading.next(false);
            });
    }

    protected handleDelete(): void {
        const filterToDelete = this.$selectedFilter.getValue()!;
        const idToDelete = filterToDelete.Id!;
        const context: ModalOptions<ConfirmModalComponent> = {
            class: 'modal-lg modal-dialog-centered',
            initialState: {
                options: {
                    title: `Delete "${filterToDelete.Name}"`,
                    message: `Are you sure you want to delete "${filterToDelete.Name}"?`
                }
            }
        };
        const modalRef = this.bsModal.show(ConfirmModalComponent, context);

        modalRef.content?.confirm
            .subscribe(() => {
                this.$isLoading.next(true);
                this.filterService.deleteFilter(idToDelete)
                    .subscribe(isDeleted => {
                        if (isDeleted) {
                            this.$selectedFilter.next(null);
                            this.updateFilters(this.filters!.filter(f => f.Id !== idToDelete));
                            this.$isLoading.next(false);
                        }
                    });
            });
    }

    private updateFilters(filters: FilterModel[]): void {
        this.$filters.next(filters);
    }
}

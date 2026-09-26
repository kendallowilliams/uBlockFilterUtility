import { Component, computed, EventEmitter, input, model, OnDestroy, Output } from '@angular/core';
import { FilterModel } from '../../../shared/models/filter.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FieldTree } from '@angular/forms/signals';

@Component({
    selector: 'app-filter-modal',
    templateUrl: 'filter-modal.component.html',
    standalone: false
})
export class FilterModalComponent implements OnDestroy {
    public form = model<FieldTree<FilterModel>>();
    public isCopy = model(false);

    public formState = computed(() => this.form()?.());

    @Output() public addFilter = new EventEmitter();
    @Output() public copyFilter = new EventEmitter();

    constructor(protected modalRef: BsModalRef) {}
    
    public ngOnDestroy(): void {
        this.addFilter.complete();
    }

    protected handleAdd(): void {
        if (this.isCopy()) {
            this.copyFilter.emit();
        } else {
            this.addFilter.emit();
        }
        this.modalRef?.hide();
    }
}
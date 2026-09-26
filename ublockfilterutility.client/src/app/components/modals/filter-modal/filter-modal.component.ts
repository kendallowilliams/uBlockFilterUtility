import { Component, computed, model, output } from '@angular/core';
import { FilterModel } from '../../../shared/models/filter.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FieldTree } from '@angular/forms/signals';

@Component({
    selector: 'app-filter-modal',
    templateUrl: 'filter-modal.component.html',
    standalone: false
})
export class FilterModalComponent {
    public form = model<FieldTree<FilterModel>>();
    public isCopy = model(false);

    public formState = computed(() => this.form()?.());

    public addFilter = output();
    public copyFilter = output();

    constructor(protected modalRef: BsModalRef) {}

    protected handleAdd(): void {
        if (this.isCopy()) {
            this.copyFilter.emit();
        } else {
            this.addFilter.emit();
        }
        this.modalRef?.hide();
    }
}
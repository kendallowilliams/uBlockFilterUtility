import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FilterModel, FilterModelForm } from '../../../shared/models/filter.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-filter-modal',
    templateUrl: 'filter-modal.component.html',
    standalone: false
})
export class FilterModalComponent implements OnDestroy {
    @Input({required: true}) public form: FormGroup<FilterModelForm> | null = null;
    @Input() public isCopy = false;

    @Output() public addFilter = new EventEmitter();
    @Output() public copyFilter = new EventEmitter();

    constructor(protected modalRef: BsModalRef) {}
    
    public ngOnDestroy(): void {
        this.addFilter.complete();
    }

    protected handleAdd(): void {
        if (this.isCopy) {
            this.copyFilter.emit();
        } else {
            this.addFilter.emit();
        }
        this.modalRef?.hide();
    }
}
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FilterModel } from '../../../shared/models/filter.model';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-filter-modal',
    templateUrl: 'filter-modal.component.html',
    standalone: false
})
export class FilterModalComponent implements OnInit,OnDestroy {
    @Input() public filter: FilterModel | null = null;

    @Output() public addFilter = new EventEmitter<FilterModel | null>();
    @Output() public copyFilter = new EventEmitter<FilterModel | null>();

    protected isCopy = false;

    constructor(protected modalRef: BsModalRef) {}

    public ngOnInit(): void {
        this.filter = this.filter ?? {};
        this.isCopy = !!this.filter.Id;
        this.filter.Id = this.filter.Name = null;
    }
    
    public ngOnDestroy(): void {
        this.addFilter.complete();
    }

    protected handleAdd(): void {
        if (this.isCopy) {
            this.copyFilter.emit(this.filter);
        } else {
            this.addFilter.emit(this.filter);
        }
        this.modalRef?.hide();
    }
}
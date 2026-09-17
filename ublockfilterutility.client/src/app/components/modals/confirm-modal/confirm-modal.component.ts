import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmModalConfig } from './confirm-modal.config';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: 'confirm-modal.component.html',
    standalone: false
})
export class ConfirmModalComponent implements OnDestroy {
    @Input() public options: ConfirmModalConfig | null = null;

    @Output() public confirm = new EventEmitter();

    constructor(protected modalRef: BsModalRef) {}
    
    public ngOnDestroy(): void {
        this.confirm.complete();
    }

    protected handleConfirm(): void {
        this.confirm.emit();
        this.modalRef?.hide();
    }
}
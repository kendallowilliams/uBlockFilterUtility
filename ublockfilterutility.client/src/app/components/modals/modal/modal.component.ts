import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalContext } from '../../../shared/models/modal-config.model';

@Component({
    selector: 'app-modal',
    templateUrl: 'modal.component.html',
    standalone: false
})
export class ModalComponent implements OnDestroy {
    @Input() public context: ModalContext | null = null;

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
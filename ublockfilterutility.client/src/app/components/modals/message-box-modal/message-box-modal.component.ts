import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalContext, MessageBoxModalType } from '../../../shared/models/modal-config.model';
import { map, Observable, of } from 'rxjs';
import { HtmlUtils } from '../../../shared/utils/html.utilts';
import { faCircleQuestion, faCircleXmark, faWarning } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-message-box-modal',
    templateUrl: 'message-box-modal.component.html',
    standalone: false
})
export class MessageBoxModalComponent implements OnDestroy, OnInit {
    @Input({required: true}) public context: ModalContext | null = null;
    @Input({required: true}) public type: MessageBoxModalType | null = null;

    @Output() public submit = new EventEmitter<string | null>();

    protected idGenerator$: Observable<string> | null = null;
    protected faCircleXmark = faCircleXmark;
    protected faCircleQuestion = faCircleQuestion;
    protected faWarning = faWarning;
    protected response?: string | null = null;

    constructor(protected modalRef: BsModalRef) {
        this.idGenerator$ = of().pipe(map(() => HtmlUtils.generateId()));
    }

    public ngOnInit(): void {
        this.response = this.context?.initialResponse;
    }
    
    public ngOnDestroy(): void {
        this.submit.complete();
    }

    protected handleSubmit(): void {
        this.submit.emit(this.response);
        this.modalRef?.hide();
    }
}
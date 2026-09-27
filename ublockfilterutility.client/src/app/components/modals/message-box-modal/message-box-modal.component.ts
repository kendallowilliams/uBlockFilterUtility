import { Component, effect, model, output, signal } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalContext, MessageBoxModalType } from '../../../shared/models/modal-config.model';
import { Observable } from 'rxjs';
import { HtmlUtils } from '../../../shared/utils/html.utilts';
import { faCircleQuestion, faCircleXmark, faWarning } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-message-box-modal',
    templateUrl: 'message-box-modal.component.html',
    standalone: false
})
export class MessageBoxModalComponent {
    public context = model<ModalContext | null>(null);
    public type = model<MessageBoxModalType | null>(null);

    public submit = output<string | null>();

    protected idGenerator$: Observable<string> = HtmlUtils.getIdGenerator();
    protected faCircleXmark = faCircleXmark;
    protected faCircleQuestion = faCircleQuestion;
    protected faWarning = faWarning;
    protected response = signal<string | null>(null);

    constructor(protected modalRef: BsModalRef) {
        effect(() => {
            this.response.set(this.context()?.initialValue || null);
        });
    }

    protected handleSubmit(): void {
        this.submit.emit(this.response());
        this.modalRef?.hide();
    }
}
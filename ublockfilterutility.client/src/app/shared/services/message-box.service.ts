import { Injectable } from "@angular/core";
import { BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ModalConfig, ModalContext } from '../models/modal-config.model';
import { MessageBoxModalComponent } from "../../components/modals/message-box-modal/message-box-modal.component";
import { defaultIfEmpty, map, Observable, takeUntil } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MessageBoxService {
    constructor(private bsModal: BsModalService) {}

    public confirm(context: ModalContext): Observable<boolean> {
        const modalRef = this.bsModal.show(MessageBoxModalComponent, this.getDefaultOptions());

        modalRef.content?.type.set('confirm');
        modalRef.content?.context.set(context);

        return new Observable<boolean>(subscriber => {
            modalRef.content?.submit
                .subscribe(() => {
                    subscriber.next(true);
                    subscriber.complete();
                });
        });
    }

    public warn(context: ModalContext): Observable<boolean> {
        const modalRef =this.bsModal.show(MessageBoxModalComponent, this.getDefaultOptions());

        modalRef.content?.type.set('warn');
        modalRef.content?.context.set(context);

        return new Observable<boolean>(subscriber => {
            modalRef.content?.submit
                .subscribe(() => {
                    subscriber.next(true);
                    subscriber.complete();
                });
        });
    }

    public error(context: ModalContext): void {
        const modalRef = this.bsModal.show(MessageBoxModalComponent, this.getDefaultOptions());

        modalRef.content?.type.set('confirm');
        modalRef.content?.context.set(context);
    }

    public alert(context: ModalContext): void {
        const modalRef = this.bsModal.show(MessageBoxModalComponent, this.getDefaultOptions());

        modalRef.content?.type.set('confirm');
        modalRef.content?.context.set(context);
    }

    public prompt(context: ModalContext): Observable<string> {
        const modalRef = this.bsModal.show(MessageBoxModalComponent, this.getDefaultOptions());

        modalRef.content?.type.set('prompt');
        modalRef.content?.context.set(context);

        return new Observable<string>(subscriber => {
            modalRef.content?.submit
                .subscribe(response => {
                    subscriber.next(response!);
                    subscriber.complete();
                });
        });
    }

    private getDefaultOptions(): ModalOptions<MessageBoxModalComponent> {
        return {
            class: 'modal-lg modal-dialog-centered'
        };
    }
}
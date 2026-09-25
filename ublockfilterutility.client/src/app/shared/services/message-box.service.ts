import { Injectable } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { ModalConfig, MessageBoxModalType } from '../models/modal-config.model';
import { MessageBoxModalComponent } from "../../components/modals/message-box-modal/message-box-modal.component";
import { defaultIfEmpty, filter, map, Observable, takeUntil } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MessageBoxService {
    constructor(private bsModal: BsModalService) {}

    public confirm(config: ModalConfig<MessageBoxModalComponent>): Observable<boolean> {
        const options = this.setModalType(config.options, 'confirm')!;
        const modalRef = this.bsModal.show(MessageBoxModalComponent, options);

        return new Observable<boolean>(subscriber => {
            modalRef.content?.submit
                .pipe(
                    takeUntil(modalRef.onHidden!.asObservable()),
                    map(() => true),
                    defaultIfEmpty(false)
                )
                .subscribe(proceed => {
                    subscriber.next(proceed);
                    subscriber.complete();
                });
        });
    }

    public warn(config: ModalConfig<MessageBoxModalComponent>): Observable<boolean> {
        const options = this.setModalType(config.options, 'warn')!;
        const modalRef =this.bsModal.show(MessageBoxModalComponent, options);

        return new Observable<boolean>(subscriber => {
            modalRef.content?.submit
                .pipe(
                    takeUntil(modalRef.onHidden!.asObservable()),
                    map(() => true),
                    defaultIfEmpty(false)
                )
                .subscribe(proceed => {
                    subscriber.next(proceed);
                    subscriber.complete();
                });
        });
    }

    public error(config: ModalConfig<MessageBoxModalComponent>): void {
        const options = this.setModalType(config.options, 'error');
        
        this.bsModal.show(MessageBoxModalComponent, options!);
    }

    public alert(config: ModalConfig<MessageBoxModalComponent>): void {
        const options = this.setModalType(config.options, 'alert');
        this.bsModal.show(MessageBoxModalComponent, options!);
    }

    public prompt(config: ModalConfig<MessageBoxModalComponent>): Observable<string> {
        const options = this.setModalType(config.options, 'prompt');
        const modalRef = this.bsModal.show(MessageBoxModalComponent, options!);

        return new Observable<string>(subscriber => {
            modalRef.content?.submit
                .pipe(takeUntil(modalRef.onHidden!.asObservable()), filter(response => !!response))
                .subscribe(response => {
                    subscriber.next(response!);
                    subscriber.complete();
                });
        });
    }

    private setModalType(
        options: ModalConfig<MessageBoxModalComponent>['options'], type: MessageBoxModalType
    ): ModalConfig<MessageBoxModalComponent>['options'] | null {
        if (options?.initialState) {
            options.initialState.type = type;
            return options;
        }

        return null;
    }
}
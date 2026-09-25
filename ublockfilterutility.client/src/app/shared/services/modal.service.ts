import { Injectable } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { ModalConfig } from '../models/modal-config.model';
import { ModalComponent } from "../../components/modals/modal/modal.component";
import { defaultIfEmpty, map, Observable, takeUntil } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    constructor(private bsModal: BsModalService) {}

    public showConfirm(config: ModalConfig<ModalComponent>): Observable<boolean> {
        const modalRef = this.bsModal.show(ModalComponent, config.options);

        return new Observable<boolean>(subscriber => {
            modalRef.content?.confirm
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

    public showWarning(config: ModalConfig<ModalComponent>): void {
        const modelRef = this.bsModal.show(ModalComponent, config.options);
    }

    public showError(config: ModalConfig<ModalComponent>): void {
        const modelRef = this.bsModal.show(ModalComponent, config.options);
    }

    public show<T>(config: ModalConfig<T>): void {
        if (config?.content) {
            const modalRef = this.bsModal.show<T>(config.content, config.options);
        }
    }
}
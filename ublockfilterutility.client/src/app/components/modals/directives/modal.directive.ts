import { Directive, effect, input, model, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";

@Directive({
    selector: 'ng-template[appModal]'
})
export class ModalDirective {
    public options = input<ModalOptions<any> | null>(null);

    public isOpen = model(false);
    private modalRef?: BsModalRef | null;

    constructor(private bsModal: BsModalService, private templateRef: TemplateRef<any>) {
        effect(() => {
            if (this.isOpen()) {
                this.show();
            } else {
                this.hide();
            }
        });
    }

    public show(): void {
        this.modalRef = this.bsModal.show(this.templateRef, this.options() || {});
    }

    public hide(): void {
        this.modalRef?.hide();
        this.modalRef = null;
    }
}
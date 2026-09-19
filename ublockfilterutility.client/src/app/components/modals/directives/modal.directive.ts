import { Directive, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";

@Directive({
    selector: 'ng-template[appModal]'
})
export class ModalDirective implements OnChanges {
    @Input() public isOpen = false;
    @Input() public options?: ModalOptions<any> | null = null;
    @Output() public isOpenChange = new EventEmitter<boolean>();

    private modalRef?: BsModalRef | null;

    constructor(private bsModal: BsModalService, private templateRef: TemplateRef<any>) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if ('isOpen' in changes) {
            if (this.isOpen) {
                this.show();
            } else {
                this.hide();
            }
        }
    }

    public show(): void {
        this.modalRef = this.bsModal.show(this.templateRef, this.options || {});
    }

    public hide(): void {
        this.modalRef?.hide();
        this.modalRef = null;
    }
}
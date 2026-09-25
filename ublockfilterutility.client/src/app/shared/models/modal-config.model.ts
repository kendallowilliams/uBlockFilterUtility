import { TemplateRef } from "@angular/core";
import { ModalOptions } from "ngx-bootstrap/modal";

export type ModalType = 'confirm' | 'alert' | 'warning' | 'error' | 'custom';

export interface ModalConfig<T> {
    options: ModalOptions<T>;
    content?: string | TemplateRef<any> | { new (...args: any[]): T }
};

export interface ModalContext {
    title: string;
    message: string;
}
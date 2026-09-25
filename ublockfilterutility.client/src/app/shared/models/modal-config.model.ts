import { TemplateRef } from "@angular/core";
import { ModalOptions } from "ngx-bootstrap/modal";

export type MessageBoxModalType = 'confirm' | 'alert' | 'warn' | 'error' | 'prompt';

export interface ModalConfig<T> {
    options: ModalOptions<T>;
    content?: string | TemplateRef<any> | { new (...args: any[]): T }
};

export interface ModalContext {
    title: string;
    message: string;
    initialResponse?: string;
};
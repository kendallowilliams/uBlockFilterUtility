export type MessageBoxModalType = 'confirm' | 'alert' | 'warn' | 'error' | 'prompt';

export interface ModalContext {
    title: string;
    message: string;
    initialValue?: string;
};
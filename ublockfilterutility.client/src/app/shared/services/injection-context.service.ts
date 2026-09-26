import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class InjectionContextService {
    private injector = inject(EnvironmentInjector);

    public runInInjectionContext(fn: () => void): void {
        runInInjectionContext(this.injector, fn);
    }
}
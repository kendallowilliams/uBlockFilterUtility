import { Injectable, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly darkModeKey = 'dark-mode-enabled';
    private readonly darkModeEnabled = signal(false);

    constructor() {
        this.darkModeEnabled.set(this.getDarkModeEnabledFromStorage());
    }

    public setDarkMode(enabled: boolean): void {
        if (enabled) {
            localStorage.setItem(this.darkModeKey, enabled ? 'true' : 'false');
        } else {
            localStorage.removeItem(this.darkModeKey);
        }

        this.darkModeEnabled.set(enabled);
    }

    public getDarkModeEnabled(): Observable<boolean> {
        return toObservable(this.darkModeEnabled)
    }

    private getDarkModeEnabledFromStorage(): boolean {
        return localStorage.getItem(this.darkModeKey) === 'true';
    }
}
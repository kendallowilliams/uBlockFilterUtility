import { effect, Injectable, RendererFactory2, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { Observable } from "rxjs";
import { AppCallback } from "../types/callback.type";

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly darkModeKey = 'dark-mode-enabled';
    private readonly darkModeEnabled = signal(false, {});
    private readonly overrideOsThemeEnabled = signal(false);
    private readonly mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    constructor(private rendererFactory: RendererFactory2) {
        const renderer = this.rendererFactory.createRenderer(null, null);
        let unlistener: AppCallback | null;
        const getOverride: AppCallback<void, boolean> = () => !!localStorage.getItem(this.darkModeKey);

        effect(() => {
            unlistener?.();
            unlistener = null;
            if (!this.overrideOsThemeEnabled()) {
                unlistener = renderer.listen(
                    this.mediaQuery, 
                    "change", 
                    () => this.setOverrideOsTheme(getOverride())
                );
            }
        });
        this.overrideOsThemeEnabled.set(getOverride());
        this.darkModeEnabled.set(this.overrideOsThemeEnabled() 
            ? this.getDarkModeEnabledFromStorage() 
            : this.getDarkModeEnabledFromSystem()
        );
        this.applyTheme(this.darkModeEnabled());
    }

    public setDarkMode(enabled: boolean): void {
        if (this.overrideOsThemeEnabled()) {
            localStorage.setItem(this.darkModeKey, enabled ? 'true' : 'false');
            this.darkModeEnabled.set(enabled);
        }
        this.applyTheme(enabled);
    }

    public applyTheme(enabled: boolean): void {
        const renderer = this.rendererFactory.createRenderer(null, null);
        
        if (enabled) {
            renderer.setAttribute(document.documentElement, 'data-bs-theme', 'dark');
        } else {
          renderer.removeAttribute(document.documentElement, 'data-bs-theme');
        }
    }

    public setOverrideOsTheme(override: boolean): void {
        if (override) {
            localStorage.setItem(this.darkModeKey, this.getDarkModeEnabledFromSystem() ? 'true' : 'false');
        } else {
            localStorage.removeItem(this.darkModeKey);
        }

        this.applyTheme(this.getDarkModeEnabledFromSystem());
        this.darkModeEnabled.set(this.getDarkModeEnabledFromSystem());
        this.overrideOsThemeEnabled.set(override);
    }

    public getOverrideOsTheme(): Observable<boolean> {
        return toObservable(this.overrideOsThemeEnabled)
    }

    public getDarkModeEnabled(): Observable<boolean> {
        return toObservable(this.darkModeEnabled)
    }

    private getDarkModeEnabledFromStorage(): boolean {
        return localStorage.getItem(this.darkModeKey) === 'true';
    }

    private getDarkModeEnabledFromSystem(): boolean {
        return this.mediaQuery.matches;
    }
}
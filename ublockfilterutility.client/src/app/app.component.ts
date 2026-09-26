import { Component, DestroyRef, Renderer2, inject } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  protected year = new Date().getFullYear();

  private destroyRef = inject(DestroyRef);

  constructor(private renderer: Renderer2, private themeService: ThemeService) {
    themeService.getDarkModeEnabled()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(enabled => {
        if (enabled) {
          this.renderer.setAttribute(document.documentElement, 'data-bs-theme', 'dark');
        } else {
          this.renderer.removeAttribute(document.documentElement, 'data-bs-theme');
        }
      });
  }
}

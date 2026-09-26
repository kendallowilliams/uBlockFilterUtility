import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FilterComponent } from './components/filter/filter.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FilterModalComponent } from './components/modals/filter-modal/filter-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterService } from './shared/services/filter.service';
import { FilterParameterComponent } from './components/filter/filter-parameter/filter-parameter.component';
import { APP_BASE_HREF } from '@angular/common';
import { ModalDirective } from './components/modals/directives/modal.directive';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FilterEffects } from './shared/stores/filter/filter.effects';
import { FILTER_REDUCER_KEY, filtersReducers } from './shared/stores/filter/filters.reducer';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MessageBoxModalComponent } from './components/modals/message-box-modal/message-box-modal.component';
import { MessageBoxService } from './shared/services/message-box.service';
import { ThemeService } from './shared/services/theme.service';
import { ParameterListComponent } from './components/parameter-list/parameter-list.component';
import { FormField, FormRoot } from '@angular/forms/signals';
import { InjectionContextService } from './shared/services/injection-context.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FilterComponent,
    FilterModalComponent,
    FilterParameterComponent,
    MessageBoxModalComponent,
    ParameterListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    ModalDirective,
    StoreModule.forRoot({ [FILTER_REDUCER_KEY]: filtersReducers }),
    EffectsModule.forRoot(FilterEffects),
    TooltipModule,
    FormField,
    FormRoot
],
  providers: [
    provideBrowserGlobalErrorListeners(),
    FilterService,
    {
      provide: APP_BASE_HREF,
      useFactory: () => {
        const segments = window.location.pathname.split('/').filter(Boolean);
        return segments.length > 0 ? `/${segments[0]}/` : '/';
      },
    },
    MessageBoxService,
    provideZonelessChangeDetection(),
    ThemeService,
    InjectionContextService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

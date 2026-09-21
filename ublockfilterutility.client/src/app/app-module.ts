import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
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
import { ConfirmModalComponent } from './components/modals/confirm-modal/confirm-modal.component';
import { FilterParameterComponent } from './components/filter/filter-parameter/filter-parameter.component';
import { APP_BASE_HREF } from '@angular/common';
import { ModalDirective } from './components/modals/directives/modal.directive';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FilterEffects } from './shared/stores/filter/filter.effects';
import { FILTER_REDUCER_KEY, filtersReducers } from './shared/stores/filter/filters.reducer';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FilterComponent,
    FilterModalComponent,
    ConfirmModalComponent,
    FilterParameterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    ModalDirective,
    StoreModule.forRoot({[FILTER_REDUCER_KEY]: filtersReducers}),
    EffectsModule.forRoot(FilterEffects)
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    FilterService, {
      provide: APP_BASE_HREF,
      useFactory: () => {
        const segments = window.location.pathname.split('/').filter(Boolean);
        return segments.length > 0 ? `/${segments[0]}/` : '/';
      },
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

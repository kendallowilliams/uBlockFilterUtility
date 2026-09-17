import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
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
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi()),
    FilterService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideRouter, RouterOutlet } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MockBackendInterceptor } from './shared/mock-backend/mock-backend.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserManagementPageComponent } from './pages/user-management/user-management.page.component';
import { UserNameApiService } from './services/user-name/user-name.api.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, RouterOutlet, NgbModule],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true },
    provideRouter([
      {
        path: '',
        component: UserManagementPageComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ]),
    UserNameApiService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

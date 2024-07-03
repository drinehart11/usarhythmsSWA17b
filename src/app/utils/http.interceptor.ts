// Purpose: Intercepts all HTTP requests to add Authorization JWT token to header and refresh token if necessary.
// ref: https://www.bezkoder.com/angular-17-jwt-auth/ (BUT ADDED Bearer TO HEADERS)
// ref2: https://www.bezkoder.com/angular-17-refresh-token/
// NOTE: SENDS AUTHORIZATION JWT TOKEN IN HEADER (FOR ALL PAGES REQUIRING AUTHORIZATION)
//      'SILENT' REFRESH JWT TOKEN IS STORED IN COOKIE

import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { EventBusService} from './event-bus.service';
import { EventData } from './event.class';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.storageService.getCookie('access_token');

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !req.url.includes('auth/signin') &&
          error.status === 401
        ) {
          if (this.storageService.isLoggedIn()) {
            return this.authService.refreshToken().pipe(
              switchMap((refreshedData) => {
                this.storageService.saveUser(refreshedData); // Save the refreshed user data
                token = this.storageService.getCookie('access_token'); // Get the new token

                // Clone the request with the new token and retry
                const authReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${token}`
                  },
                  withCredentials: true,
                });

                return next.handle(authReq);
              }),
              catchError((refreshErr) => {
                console.log('Failed to refresh token');
                // Handle refresh token error
                return throwError(() => refreshErr);
              })
            );
          }
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (this.storageService.isLoggedIn()) {
        return this.authService.refreshToken().pipe(
          switchMap(() => {
            this.isRefreshing = false;

            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;

            if (error.status == '403') {
              this.eventBusService.emit(new EventData('logout', null));
            }

            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(request);
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];

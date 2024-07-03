import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environment/env';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, delay, catchError, map, shareReplay } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';
import { StorageService } from './storage.service';
import { jwtDecode } from 'jwt-decode';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  //API_URL = environment.API_URL + 'login'; //JWT
  API_URL = environment.API_URL + 'login';
  username: string | null = null;
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.loggedIn.asObservable(); //set upon login/logout (but default is false)

  constructor(
    private router: Router,
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      this.API_URL,
      {
        username,
        password,
      },
      httpOptions
    ).pipe(
      tap((response: any) => {
        // After a successful login, set loggedIn to true & store JWT

        // Save the access token and refresh token to the cookie storage
        this.storageService.setCookie('access_token', response.access);
        this.storageService.setCookie('refresh_token', response.refresh);

        console.log(this.getDecodedAccessToken(response.access)['user_id']);

        this.loggedIn.next(true);
      })
    );
  }
  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch(Error) {
      return null;
    }
  }
  logout(): Observable<any> {
    // Update the loggedIn BehaviorSubject to false
    this.loggedIn.next(false);

    // Subscribe to isLoggedIn Observable and log its value
    this.isLoggedIn.subscribe(value => {
      //console.log('isLoggedIn value after logout:', value);

      // Remove JWT token and user data from storage
      this.storageService.clean();

      // Navigate the user back to the login page
      this.router.navigate(['/login']).then(() => {
        // Navigation succeeded
      }).catch((error) => {
        // Navigation failed
        console.error('Navigation error:', error);
      });
    });

    // Return an Observable of null
    return of(null);
  }

  //CURRENTLY (AS OF 5-APR-2024) refreshToken MUST BE IN BODY OF REQUEST (NOT HEADER) FOR COMPATIBILITY WITH DJANGO
  refreshToken() {
    const refreshToken = this.storageService.getCookie('refresh_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${refreshToken}`
    });

    console.log('Refresh Token:', refreshToken);
    return this.http.post(this.API_URL + '/refresh', {refresh: refreshToken}, { headers });
  }

  isTokenExpired(): boolean {
    const accessToken = this.storageService.getCookie('access_token');
    if (!accessToken) {
      return true;
    }

    const decoded = jwtDecode(accessToken);
    if (decoded.exp === undefined) {
      return false;
    }

    const date = new Date(0);
    let tokenExpDate = date.setUTCSeconds(decoded.exp);
    if (tokenExpDate.valueOf() > new Date().valueOf()) {
      return false;
    }

    return true;
  }
}

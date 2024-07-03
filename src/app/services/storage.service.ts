import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode'; //REQUIRED FOR EXTRACTING DATA FROM JWT TOKEN (api_key)

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  apiKey: string;
  access_token: string;

  constructor() {
    this.apiKey = ''; // INITIALIZE WITH EMPTY STRING [UNTIL POPULATED FROM API CALLBACK OR DECODED JWT]
    this.access_token = ''; // INITIALIZE WITH EMPTY STRING [UNTIL POPULATED FROM API CALLBACK OR DECODED JWT]
  }

  clean(): void {
    window.sessionStorage.clear();
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; //PART OF 'STORE REFRESH JWT TOKEN IN COOKIE'
  }

  public saveUser(user: any): void {
    this.clean();
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));

    document.cookie = `access_token=${user.access}; path=/;`;
    if (user.access) {
      const decodedToken: any =jwtDecode(user.access);
      this.apiKey = decodedToken.api_key;
    }
  }

  public getApiKey(): string {
    if (!this.apiKey){//PULL FROM COOKIE IF NOT IN MEMORY
      this.access_token = this.getCookie('access_token');
      if (this.access_token) {
        const decodedToken: any =jwtDecode(this.access_token);
        this.apiKey = decodedToken.api_key;
        // console.log('DEBUG: (apiKey) - ' + this.apiKey);
      }
    }
    return this.apiKey;
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  getCookie(name: string): string {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue ? cookieValue : '';
    }
    return '';
  }

  public setCookie(name: string, value: string, days: number = 7): void {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }
}

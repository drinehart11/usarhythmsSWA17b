import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/env';
import { HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  API_URL = environment.API_URL;
  private httpClient = inject(HttpClient);
  private storageService: StorageService;
  private authService: AuthService;

  constructor(storageService: StorageService) {
    this.storageService = storageService;
    this.authService = inject(AuthService);
  }

  fetchDatasets() {
    const accessToken = this.storageService.getCookie('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    return this.httpClient.get(this.API_URL + 'dandisets', { headers });
  }

  fetchUserProfile() {
    //NEED TO SORT OUT WHAT DETAILS WILL PULL FROM SERVER WHEN USER PROFILE SELECTED (PENDING ON 12-JUN-2024)
    //api KEY IS PULLED FROM DECODED JWT


    // console.log('Access Token:', accessToken);
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${accessToken}`
    // });
    // return this.httpClient.get(this.API_URL + 'users/me', { headers });
  }
}

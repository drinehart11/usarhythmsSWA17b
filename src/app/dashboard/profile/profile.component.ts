import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { DataService } from '../../services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from '../../../environment/env';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  apiKey: string = '';

  API_URL = environment.API_URL + 'users/me/';
  leftnavExpanded: boolean = false;

  //NEED TO SORT OUT WHAT DETAILS WILL PULL FROM SERVER WHEN USER PROFILE SELECTED (PENDING ON 12-JUN-2024)
  apiResponse: any = [];
  http = inject(HttpClient)


  // INJECT AuthService, StorageService TO HANDLE JWT TOKEN REFRESH, IF EXPIRED
  constructor(
    private authService: AuthService,
    private storageService: StorageService
  ) {

  }

  private dataService = inject(DataService);
  user_profile: any = [];

  ngOnInit(): void {
    this.apiKey = this.storageService.getApiKey();
    if (!this.apiKey){
      this.fetchUserProfile();
    }
    console.log('DEBUG: (apiKey) - ' + this.apiKey);
  }
  fetchUserProfile(){

  }
  // loadUserProfile() {
  //  NEED TO SORT OUT WHAT DETAILS WILL PULL FROM SERVER WHEN USER PROFILE SELECTED (PENDING ON 12-JUN-2024)
  //   this.http.get(this.API_URL)
  //     .subscribe((data: any) => {
  //       //this.apiResponse = data['apikey'];
  //       this.apiResponse = data;
  //       console.log('USER PROFILE: ' +this.apiResponse)
  //     });
  // }
}

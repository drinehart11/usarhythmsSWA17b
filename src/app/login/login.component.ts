import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Notyf } from 'notyf';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

const redirectUrl: string = '/dashboard';
const navigationExtras: NavigationExtras = {
  queryParamsHandling: 'preserve',
  preserveFragment: true
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  loading = false; //start page with loading spinner off


  //TEMPLATE-DRIVEN FORM
  frm_Login_Model: any = {
    username: '',
    password: '',
  };

  //AUTHENTICATION, JWT STORAGE
  constructor(
    public authService: AuthService,
    private storageService: StorageService,
    public router: Router,
  ){

  }

  login(form: any) {
    this.loading = true; // DISPLAY LOADING SPINNER WHILE PROCESSING

    this.authService.login(this.frm_Login_Model.username, this.frm_Login_Model.password).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.router.navigate([redirectUrl], navigationExtras);
      },
      error: err => {
        console.log('Incorrect username or password');
        this.loading = false;// Stop the spinner
        this.notyf.open({
          type: 'error',
          message: 'Incorrect username or password',
          position: { x: 'center', y: 'center' },
          icon: false
        });
      }
    });
  }

  //INITIALIZE
  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        this.router.navigate([redirectUrl], navigationExtras);
      }
    });
  }
  //INITIAL DISCLOSURES
  notyf = new Notyf();
    ngAfterViewInit(): void {
      this.notyf = new Notyf();
      this.showNotification();
  }
  showNotification() {
    this.notyf.open({
      type: 'success',
      background: 'orange',
      message:'Portal restricted to U19 members',
      position: {x:'right',y:'bottom'},
      icon: false
    });
  }
}

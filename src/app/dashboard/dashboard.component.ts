import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router";
import { environment } from '../../environment/env';


@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  title = environment.TITLE;
  leftnavExpanded: boolean = false;

  constructor(
    public authService: AuthService,
    public router: Router
  ){}

  onLeftNavToggle(expanded: boolean) {
    this.leftnavExpanded = expanded;
    // You might want to add a small delay here if you need to resize any child components
    setTimeout(() => {
      // Emit an event or call a method to resize child components if needed
    }, 300);
  }
}

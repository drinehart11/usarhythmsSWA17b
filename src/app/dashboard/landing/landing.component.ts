import { Component, inject, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {environment} from '../../../environment/env';


@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  API_URL = environment.API_URL + 'stats';
  title = 'USArhythms Data Sharing Portal';
  @Input() leftnavExpanded: boolean = false;

  http = inject(HttpClient)
  datasets_count: any = [];

  ngOnInit() {
    this.fetchDatasets();
  }
  fetchDatasets() {
    this.http.get(this.API_URL)
      .subscribe((data: any) => {
        this.datasets_count = data['dandiset_count'];
      });
  }
}

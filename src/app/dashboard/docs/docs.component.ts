import { Component, inject, OnInit } from '@angular/core';
import { environment } from "../../../environment/env";

@Component({
  selector: 'app-docs',
  standalone: false,
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.scss'
})
export class DocsComponent {
  leftnavExpanded: boolean = false;
}

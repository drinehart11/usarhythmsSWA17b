import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-leftnav',
  standalone: false,
  templateUrl: './leftnav.component.html',
  styleUrl: './leftnav.component.scss'
})
export class LeftnavComponent {
  @Input() isExpanded: boolean = true;
  @Output() toggle: EventEmitter<boolean> = new EventEmitter<boolean>();

  toggle_left_nav = () => this.toggle.emit(!this.isExpanded);
}

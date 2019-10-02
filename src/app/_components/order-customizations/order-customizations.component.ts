import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-order-customizations',
  templateUrl: './order-customizations.component.html',
  styleUrls: ['./order-customizations.component.css']
})
export class OrderCustomizationsComponent implements OnInit {

  @Input() orderCustomizationGroups: any;

  constructor() { }

  ngOnInit() {
  }

}
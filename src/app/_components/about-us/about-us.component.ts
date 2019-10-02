import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  platformName: string = environment.platformName;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Windows navigated to by sibling resourse do
    // not automtically scroll to top. Thiw sill scroll to top
      window.scrollTo(0, 0);
  }

}
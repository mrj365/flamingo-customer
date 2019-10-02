import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: [
    './footer.component.css'
    ]
})
export class FooterComponent implements OnInit {

  platformName = environment.platformName;

  fbSocialUrl = environment.fbSocialUrl;
  showFbSocial = environment.showFbSocial;
  twitterSocialUrl = environment.twitterSocialUrl;
  showTwitterSocial = environment.showTwitterSocial;
  linkedInSocialUrl = environment.linkedInSocialUrl;
  showLinkedInSocial = environment.showLinkedInSocial;
  instagramSocialUrl = environment.instagramSocialUrl;
  showInstagramSocial = environment.showInstagramSocial;

  constructor() { }

  ngOnInit() {

  }

}
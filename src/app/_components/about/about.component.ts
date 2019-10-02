import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

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

  route(url: string){
    document.location.href = url;
  }
}

import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  privacyUrl: SafeUrl;
  el: HTMLFrameElement;

  constructor(private sanitizer: DomSanitizer) { 

      this.privacyUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.privacyUrl) ;
      
      window.addEventListener('message', this.receiveMessage, false);
      
  }

  ngOnInit() {
  }

  receiveMessage(event) {
    let iframeId = 'privacy';
    let iframe = '#' + iframeId;

    //only receive messages from iframe src
    if ($(iframe).attr('src').startsWith(event.origin)) {
    
      //messages with a numeric payload means iframe height
      if (!isNaN(event.data)){
        document.getElementById(iframeId).style.height = 'auto';
        $(iframe).height(event.data + 'px');
      }
    }
  }
}
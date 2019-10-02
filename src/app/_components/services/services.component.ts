import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  externalUrl: SafeUrl;
  el: HTMLFrameElement;

  constructor(private sanitizer: DomSanitizer) {
    this.externalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.staticImgPath + 'sitedocs/terms.htm'); 
    window.addEventListener('message', this.receiveMessage, false);

   }

  ngOnInit() {
  }

  receiveMessage(event) {
    let iframeId = 'genericIframe';
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
